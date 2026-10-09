const express=require("express");
const router=express.Router();

const {auth}=require("../middlewares/authMiddleware");
const {addTransaction,getTransactions,deleteTransaction,updateTransaction}
=require("../controllers/transactionController");

router.post("/transactions",auth,addTransaction);
router.get("/transactions",auth,getTransactions);
router.delete("/transactions/:id",auth,deleteTransaction);
router.put("/transactions/:id",auth,updateTransaction);


module.exports=router;
