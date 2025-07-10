import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
    try {
        const {userId} = req.params;

        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;`
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error!!!"})
        console.log(error)
    }
}

export async function createTransaction(req, res) {
    try {
            // The destructured elements would be undefined if express.json() middleware is not used
            const {title, amount, category, user_id} = req.body
            if (!title || !category || !user_id || amount === undefined) {
                res.status(400).json({message: "All fields must have values"})
            }
    
            const transactions = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES(${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
            `
            console.log(transactions)
            res.status(200).json(transactions[0])
    
        } catch (error) {
            res.status(500).json({message: "Internal Server Error!!!"})
            console.log(error)
        }
}

export async function deleteTransactionById(req, res) {
    try {
            const {id} = req.params;
    
            if (isNaN(parseInt(id))) {
                return res.status(400).json({message: "Id should be a number"})
            }
    
            const transactions = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *;`
    
            if (transactions.length === 0) {
                return res.status(404).json({message: "Transaction id not found"})
            }
    
            res.status(200).json({message: `Transaction with id ${id} has been deleted successfully`})
        } catch (error) {
            res.status(500).json({message: "Internal Server Error!!!"})
            console.log(error)
        }
}

export async function getSummaryByUserId(req, res) {
    try {
        const {userId} = req.params;

        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId};
        `
        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0;
        `
        const expenseResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0;
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        })
    } catch (error) {
        res.status(500).json({message: "Internal Server Error!!!"})
        console.log(error)
    }
}