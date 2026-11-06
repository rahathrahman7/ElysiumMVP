/**
 * Test helpers that mutate schema/roles always restore in `finally`.
 * Table/role identifiers are restricted to Postgres unquoted-ident syntax.
 */

export type SqlClient = {
  query: (sql: string, params?: unknown[]) => Promise<unknown>;
};

const IDENT_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function assertSafeIdent(name: string, kind: string): string {
  if (!IDENT_RE.test(name)) {
    throw new Error(`Unsafe ${kind} identifier: ${name}`);
  }
  return name;
}

export async function withRenamedTable<T>(
  client: SqlClient,
  names: { from: string; to: string },
  fn: () => Promise<T>
): Promise<T> {
  const from = assertSafeIdent(names.from, "table");
  const to = assertSafeIdent(names.to, "table");
  await client.query(`ALTER TABLE ${from} RENAME TO ${to}`);
  try {
    return await fn();
  } finally {
    await client.query(`ALTER TABLE ${to} RENAME TO ${from}`);
  }
}

export async function withTemporaryTableGrant<T>(
  client: SqlClient,
  grant: { table: string; role: string; privilege: string },
  fn: () => Promise<T>
): Promise<T> {
  const table = assertSafeIdent(grant.table, "table");
  const role = assertSafeIdent(grant.role, "role");
  const privilege = assertSafeIdent(grant.privilege, "privilege");
  await client.query(`GRANT ${privilege} ON TABLE ${table} TO ${role}`);
  try {
    return await fn();
  } finally {
    await client.query(`REVOKE ${privilege} ON TABLE ${table} FROM ${role}`);
  }
}

export async function withEphemeralLoginRole<T>(
  client: SqlClient,
  role: { name: string; password: string },
  fn: () => Promise<T>
): Promise<T> {
  const name = assertSafeIdent(role.name, "role");
  if (!role.password) {
    throw new Error("Ephemeral test roles require a password");
  }
  await client.query(`CREATE ROLE ${name} LOGIN PASSWORD $1`, [role.password]);
  try {
    return await fn();
  } finally {
    await client.query(`DROP ROLE IF EXISTS ${name}`);
  }
}
