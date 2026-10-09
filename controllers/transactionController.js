const Transaction=require("../models/Transaction");
const {checkBudgetStatus}=require("./budgetController")

exports.addTransaction=async(req,res)=>{
    try{
        const {type,amount,category,note}=req.body;

        const transaction=await Transaction.create({user:req.user.id,type,amount,category,note});

        let status=null;
        if(transaction.type==="expense"){
            const result=await checkBudgetStatus(req.user.id,category);
            status=result ? result.isOverBudget : null;
        }
        res.status(201).json({
            success:true,
            message:"Transaction added successfully",
            transaction,
            budgetStatus:status
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error while adding transaction"
        })
    }
}

exports.getTransactions=async(req,res)=>{
    try{
        const transaction=await Transaction.find({user:req.user.id}).sort({date:-1});

        return res.status(200).json({
            success:true,
            transaction
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"error while fetching transactions"
        })
    }
}

exports.deleteTransaction=async(req,res)=>{
    try{
        const {id}=req.params;

        const transaction=await Transaction.findById(id);

        if(!transaction){
            return res.status(404).json({
                success:false,
                message:"Transaction not found"
            })
        }

        if(transaction.user.toString()!==req.user.id){
            return res.status(403).json({
                success:false,
                message:"Not authorised to delete this transaction"
            })
        }

        await Transaction.findByIdAndDelete(id);

        return res.status(200).json({
            success:true,
            message:"transaction deleted successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"error while deleting transactions"
        })
    }
}

exports.updateTransaction = async (req, res) => {
    try {
        const {id} = req.params;
        const {type, amount, category, note} = req.body;

        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        if (transaction.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorised to update this transaction"
            });
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            {type, amount, category, note},
            {new: true}
        );

        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            transaction: updatedTransaction
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating transaction"
        });
    }
};
