const express=require("express");
require("dotenv").config();

const app=express();
app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const PORT=process.env.PORT || 4000;

const connectDb=require("./config/database");
connectDb();

const routes=require("./routes/authRoutes");
app.use("/api/v1",routes);

const transactionRoutes=require("./routes/transactionRoutes");
app.use("/api/v1",transactionRoutes);

const budgetRoutes=require("./routes/budgetRoutes");
app.use("/api/v1",budgetRoutes);


app.get("/",(req,res)=>{
    res.send(`Welcome to home page`);
});

app.listen(PORT,()=>{
    console.log("App started successfully at PORT:",PORT);
});
