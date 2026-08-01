import app from "../app.js";
import connectdb from "../src/config/db.js";

let connectionPromise;

export default async function handler(req, res) {
  try {
    connectionPromise ??= connectdb();
    await connectionPromise;
    return app(req, res);
  } catch (error) {
    connectionPromise = undefined;
    console.error("Database connection failed:", error);
    return res.status(503).json({
      success: false,
      message: "Database connection is unavailable",
      errors: [],
    });
  }
}
