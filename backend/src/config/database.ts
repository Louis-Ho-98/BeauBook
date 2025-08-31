import { Sequelize, Options } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Database connection configuration
const dbConfig: Options = {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  dbConfig
);

export default sequelize;
