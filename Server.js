import express from "express";
import dotenv from "dotenv";
import { UserRouter } from "./Router/user.js";
import { connectingToMongoDb } from "./db.js";
import cors from "cors"


dotenv.config();

const PORT =process.env.PORT;
const App=express();
App.use(express.json());
App.use(cors())

App.use("/api/user",UserRouter);

App.listen(PORT,()=>{
    console.log(`SERVER CONNECTED WITH PORT :${PORT}`)
});

connectingToMongoDb();


