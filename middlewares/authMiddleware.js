const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.auth=(req,res,next)=>{
    try{

        let token= req.cookies.token || req.body.token ||
        req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token Missing"
            })
        }

        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);

            req.user=payload;
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while verifying token"
        })
    }
}
