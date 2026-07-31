#!/usr/bin/env node
/**
 * Upsert TMC review/match seed JSON into Postgres.
 * Usage: DATABASE_URL=... node scripts/db/seed-tmc-from-json.mjs
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("Set DATABASE_URL (or POSTGRES_PRISMA_URL / POSTGRES_URL)");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  max: 1,
  connectionTimeoutMillis: 15_000,
});

const reviews = JSON.parse(readFileSync(join(root, "public/data/tmc-reviews.json"), "utf8")).reviews || {};
const bySlug = JSON.parse(readFileSync(join(root, "public/data/tmc-matches.json"), "utf8")).bySlug || {};

const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query(`
    CREATE TABLE IF NOT EXISTS waitlist_signups (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      source TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT waitlist_signups_email_source_key UNIQUE (email, source)
    );
    CREATE INDEX IF NOT EXISTS waitlist_signups_source_idx ON waitlist_signups(source);

    CREATE TABLE IF NOT EXISTS tmc_ring_reviews (
      handle TEXT PRIMARY KEY,
      keep BOOLEAN NOT NULL DEFAULT false,
      "displayName" TEXT,
      "priceGbp" TEXT,
      notes TEXT,
      "preferredMetal" TEXT,
      options TEXT,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tmc_ring_matches (
      "elysiumSlug" TEXT PRIMARY KEY,
      "elysiumTitle" TEXT,
      "tmcHandle" TEXT,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  for (const [handle, r] of Object.entries(reviews)) {
    await client.query(
      `INSERT INTO tmc_ring_reviews (handle, keep, "displayName", "priceGbp", notes, "preferredMetal", options, "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP)
       ON CONFLICT (handle) DO UPDATE SET
         keep = EXCLUDED.keep,
         "displayName" = EXCLUDED."displayName",
         "priceGbp" = EXCLUDED."priceGbp",
         notes = EXCLUDED.notes,
         "preferredMetal" = EXCLUDED."preferredMetal",
         options = EXCLUDED.options,
         "updatedAt" = CURRENT_TIMESTAMP`,
      [
        handle,
        !!r.keep,
        r.displayName || null,
        r.priceGbp || null,
        r.notes || null,
        r.preferredMetal || null,
        r.options ? JSON.stringify(r.options) : null,
      ]
    );
  }

  for (const [elysiumSlug, m] of Object.entries(bySlug)) {
    await client.query(
      `INSERT INTO tmc_ring_matches ("elysiumSlug", "elysiumTitle", "tmcHandle", "updatedAt")
       VALUES ($1,$2,$3,CURRENT_TIMESTAMP)
       ON CONFLICT ("elysiumSlug") DO UPDATE SET
         "elysiumTitle" = EXCLUDED."elysiumTitle",
         "tmcHandle" = EXCLUDED."tmcHandle",
         "updatedAt" = CURRENT_TIMESTAMP`,
      [elysiumSlug, m.elysiumTitle || null, m.tmcHandle || null]
    );
  }

  await client.query("COMMIT");
  const counts = await client.query(`
    SELECT
      (SELECT COUNT(*)::int FROM tmc_ring_reviews) AS reviews,
      (SELECT COUNT(*)::int FROM tmc_ring_reviews WHERE keep) AS keep_true,
      (SELECT COUNT(*)::int FROM tmc_ring_matches) AS matches
  `);
  console.log(counts.rows[0]);
} catch (e) {
  await client.query("ROLLBACK").catch(() => {});
  console.error(e);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
