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

// Initialize and populate database
async function initializeDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log("Database connection established");

    // Load and execute create_tables.sql
    const createSqlPath = path.join(__dirname, "../../data/create_tables.sql");
    console.log("Attempting to load create_tables.sql from:", createSqlPath);
    let createSql;
    try {
      createSql = await fs.readFile(createSqlPath, "utf-8");
    } catch (error) {
      console.error("Failed to read create_tables.sql:", error);
      throw error;
    }
    await sequelize.query(createSql, { raw: true });
    console.log("Database schema initialized");

    // Load and execute populate_tables.sql
    const populateSqlPath = path.join(__dirname, "../../data/populate_tables.sql");
    console.log("Attempting to load populate_tables.sql from:", populateSqlPath);
    let populateSql;
    try {
      populateSql = await fs.readFile(populateSqlPath, "utf-8");
    } catch (error) {
      console.error("Failed to read populate_tables.sql:", error);
      throw error;
    }
    await sequelize.query(populateSql, { raw: true });
    console.log("Database populated with initial data");

    // Sync models
    await sequelize.sync({ force: false });
    console.log("Models synchronized");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();