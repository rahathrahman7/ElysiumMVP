import { createClient } from "@sanity/client";
import { env, requireEnv } from "@/lib/env";

async function main() {
  const client = createClient({ projectId: env.SANITY_PROJECT_ID, dataset: env.SANITY_DATASET, apiVersion: "2024-07-01", token: requireEnv("SANITY_API_TOKEN") });

  const demoProducts = Array.from({ length: 8 }).map((_, i) => ({
    _type: "product",
    title: `Demo Piece ${i + 1}`,
    slug: { current: `demo-piece-${i + 1}` },
    description: "A refined piece demonstrating the ELYSIUM standard.",
    images: [],
    basePriceGBP: 250000 + i * 50000,
    options: {
      metals: [ { name: "18k Yellow Gold", priceDelta: 0 }, { name: "Platinum", priceDelta: 50000 } ],
      stones: [ { name: "Diamond", priceDelta: 0 }, { name: "Sapphire", priceDelta: -20000 } ],
    },
    ringSizes: ["K", "L", "M", "N"],
    inStock: true,
    featured: i < 3,
  }));

  await Promise.all(demoProducts.map((doc) => client.create(doc)));
  console.log("Seeded 8 demo products");
}

main().catch((e) => { console.error(e); process.exit(1); });


