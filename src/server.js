import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { initDB } from "./config/db.js";
import job from "./config/cron.js";

const app = express();
dotenv.config();

if (process.env.NODE_ENV === "production") {
  job.start()
}

const port = process.env.PORT;

app.use(rateLimiter);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({status: "ok"})
})
app.use("/api/transactions", transactionRoutes);

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
});
