import "dotenv/config";
import { Sequelize } from "sequelize";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not defined");
  process.exit(1);
}

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  retry: {
    match: [
      /SequelizeHostNotFoundError/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /SequelizeConnectionError/,
    ],
    max: 10,
    backoffBase: 1000,
    backoffExponent: 1.5,
  },
  logging: process.env.DEBUG?.includes("sequelize") ? console.log : false,
});

// Initialize database schema
async function initializeDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log("Database connection established");

    // Load and execute create_tables.sql
    const sqlPath = path.join(__dirname, "..", "data", "create_tables.sql");
    const sql = await fs.readFile(sqlPath, "utf-8");
    await sequelize.query(sql, { raw: true });
    console.log("Database schema initialized");

    // Optional: Sync models (if using Sequelize models)
    await sequelize.sync({ force: false });
    console.log("Models synchronized");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();