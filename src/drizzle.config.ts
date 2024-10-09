import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./schema.ts",
  out: "./scripts/drizzle",
  dbCredentials: {
    url: "postgres://postgres:postgres@subtubes-postgres:5432/subtubes",
  },
});
