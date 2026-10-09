const express=require("express");
const router=express.Router();
const {auth}=require("../middlewares/authMiddleware");
const {setBudget,getBudgets}=require("../controllers/budgetController");

router.post("/budgets",auth,setBudget);
router.get("/budgets",auth,getBudgets);

module.exports=router;
