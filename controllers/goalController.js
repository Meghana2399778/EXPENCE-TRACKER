const SavingsGoal=require("../models/SavingsGoal");


exports.createGoal = async (req, res) => {
    try {
        const {goalName, targetAmount} = req.body;

        const goal = await SavingsGoal.create({
            user: req.user.id,
            goalName,
            targetAmount
        });

        return res.status(201).json({
            success: true,
            message: "Goal created successfully",
            goal
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while creating goal"
        });
    }
};

exports.getGoals=async(req,res)=>{
    try{
        const goals=await SavingsGoal.find({ user: req.user.id});
        
        const goalsWithProgress=goals.map((goal)=>({
            ...goal.toObject(),
            percentComplete:Math.round((goal.savedAmount/goal.targetAmount)*100)
        }));

        return res.status(200).json({
            success:true,
            goal:goalsWithProgress
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while getting the goals"
        })
    }
}

exports.updateGoalProgress=async(req,res)=>{
    try{
        const {id}=req.params;
        const {amount}=req.body;

        const goal=await SavingsGoal.findOne({_id:id});

        const updatedGoal = await SavingsGoal.findByIdAndUpdate(
            id,
            {savedAmount: goal.savedAmount + amount},
            {new: true}
        );

        return res.status(200).json({
            success: true,
            message: "Progress updated successfully",
            goal: updatedGoal
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while updating progress"
        })
    }
}
