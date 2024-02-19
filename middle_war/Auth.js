import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.js";
dotenv.config();

  function  verifyToken(req,res,next) {
const authHead = req.headers.authorization;

if(!authHead){
    res.json({message:"Token not found"})
}

const token = authHead.split(" ")[1];

jwt.verify(token,process.env.SECRECT_KEY,async(err,decode)=>{
    if(err){
       return res.status(403).json({message:"invalid token"})
    }

    const user = await User.findOne({_id:decode.id});

    if(!user){
        return res.status(404).json({message:"user not found"})
    }


    req.user = user;
    next(); 


})

}

export default verifyToken;