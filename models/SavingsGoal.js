const mongoose=require("mongoose");

const savings=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    goalName:{
        type:String,
        required:true
    },
    targetAmount:{
        type:Number,
        required:true
    },
    savedAmount:{
        type:Number,
        default:0
    }
});


module.exports=mongoose.model("SavingsGoal",savings);
