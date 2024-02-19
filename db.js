import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();


export function connectingToMongoDb(){
    const  DB_URL=process.env.DB_URL
    let params={
        
    };

    mongoose.connect(DB_URL,params)
    .then(()=>console.log(`DB-CONNECTED SUCCESSFULLY`))
    .catch((err)=>console.log(err.message))
}

