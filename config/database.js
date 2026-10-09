const mongoose=require("mongoose");
require("dotenv").config();

const connectDb=async()=>{

    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log("DB connected successfully")})
    .catch((err)=>{
        console.log("Error while connecting database");
        console.error(err);
        process.exit(1);
    })
}

module.exports=connectDb;
