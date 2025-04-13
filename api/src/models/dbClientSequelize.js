import "dotenv/config";
import { Sequelize } from "sequelize";

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
    ],
    max: 10,
    backoffBase: 1000,
    backoffExponent: 1.5,
  },
  logging: process.env.DEBUG?.includes("sequelize") ? console.log : false,
});