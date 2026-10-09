const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/User");
require("dotenv").config();


exports.signup=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        const user=await User.findOne({email});

        if(user){
            return res.status(400).json({
                success:false,
                message:"Already signed up pls login"
            });
        }

        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }
        catch(error){
            return res.status(500).json({
                success:false,
                message:"Error while hashing the password"
            })
        }

        const newUser=await User.create({name,email,password:hashedPassword});

        res.status(201).json({
            success:true,
            message:"User signed up successfully"
        });

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error during the sign up"
        })
    }
}


exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            })
        }

        let user=await User.findOne({email});

        if(!user){
            return res.status(403).json({
                success:false,
                message:"Pls signup before login"
            })
        }

        let payload={
            id:user._id,
            email:user.email
        }

        if(await bcrypt.compare(password,user.password)){

            const token=jwt.sign(payload,
                                 process.env.JWT_SECRET,
                                 {
                                    expiresIn:"2h"
                                 });
            
            user=user.toObject();
            user.password=undefined;
            user.token=token;

             const options={
             expires:new Date(Date.now() + 24*60*60*1000),
            sameSite: "strict",
             httpOnly:true,
           }

            return res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User logged in successfully"
            });

        }
        else{
            return res.status(403).json({
                success:false,
                message:"Incorrect password"
            })
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
