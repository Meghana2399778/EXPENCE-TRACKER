const Budget=require("../models/Budget");
const Transaction=require("../models/Transaction");

exports.setBudget=async(req,res)=>{
    try{
        const {category,limit}=req.body;

        const user=await Budget.findOne({category:category,user:req.user.id});

        if(!user){
            const newBudget=await Budget.create({user:req.user.id,category,limit});

            return res.status(201).json({
                success:true,
                message:"Budget assigned successfully",
                budget:newBudget
            });
        }

       const updatedBudget = await Budget.findByIdAndUpdate(
       user._id,
       {limit},
       {new: true}
       );

        return res.status(200).json({
            success:true,
            message:"Budget updated successfully",
            budget:updatedBudget
        });
    }
    catch(error){

        return res.status(500).json({
            success:false,
            message:"Error while setting the budget"
        })
    }
}

exports.getBudgets=async(req,res)=>{
    try{
        const budgets=await Budget.find({user:req.user.id});

        
        return res.status(200).json({
            success:true,
            budget:budgets
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while getting the budget"
        })
    }
}

exports.checkBudgetStatus=async(userId,category)=>{

        const budget=await Budget.findOne({user:userId,category});

        if(!budget){
            return null;
        }

        const now = new Date();
       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
       const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const transactions=await Transaction.find({
            user:userId,
            category:category,
            type:"expense",
            date:{$gte:startOfMonth , $lte:endOfMonth}
        });

        const spent=transactions.reduce((total,t)=> total+t.amount,0);
        const percentUsed=(spent/budget.limit) *100;

        return{
            limit:budget.limit,
            spent,
            percentUsed:Math.round(percentUsed),
            isOverBudget:spent > budget.limit
        }
}
