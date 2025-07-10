import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { initDB } from "./config/db.js";

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(rateLimiter);
app.use(express.json());
app.use("/api/transactions", transactionRoutes);

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
});
