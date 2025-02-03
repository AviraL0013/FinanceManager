const userModel = require('../models/User.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistToken.Model');


module.exports.authUser=async(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Unauthorized',error:'Token not found'});
    }
    const isBlacklisted= await BlacklistToken.findOne({token:token});
    if(isBlacklisted){
        return res.status(401).json({message:'Unauthorized',error:'Token is blacklisted'});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded._id);

        req.user=user;

        return next();
    }
    catch(err){
        
        return res.status(401).json({message:'Unauthorized',error:err.message});
        
        
    }
}