import { User } from "../models/user.js";

 const newPass = async(req,res,next)=>{

    const {token}    = req.params ;

    try {
        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExp:{$gt : Date.now()}
        })
        if(!user){
        return    res.status(401).send("Invalid Token");
        }}
        catch(error){
        res.send(error)
        }
        
        next()
}

export default newPass;