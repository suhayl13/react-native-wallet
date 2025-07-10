import express from "express";
import {
  createTransaction,
  deleteTransactionById,
  getSummaryByUserId,
  getTransactionsByUserId,
} from "../controllers/transactionControllers.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransactionById);
router.get("/summary/:userId", getSummaryByUserId);

export default router;
