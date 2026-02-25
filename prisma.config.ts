// @ts-expect-error Prisma config module has no type declarations
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
  },
  migrations: {
    path: './prisma/migrations',
    seed: 'pnpm db:seed'
  }
});
