const jwt = require("jsonwebtoken")
const student = require("../models/student");

const isLogin = async(req,res,next)=>{
    if(req.cookies.token){
        next();
    }
    else{
        res.redirect("/");
    }
}

const isLogOut = async(req,res,next)=>{
    if(req.cookies.token){
        res.redirect("/dashboard");
    }
    else{
        next();
    }
    
}

// verify user middle ware
const verifyUser = async(req, res,next)=>{
    try{
        let token = req.cookies.token
        const verifyUser = jwt.verify(token,"Yo")
        req.user_id = verifyUser._id
        next()
    }
    
    catch(err){
        console.log("User verification failed as "+ err.message)
        res.redirect("/")
    }
}

const truckUserMatching = async(req, res, next)=>{
    id = req.user_id
    users.findOne({_id:id},(err,result)=>{
        truckArray = result.Truck
        if(truckArray.includes(req.query.truck)){
            req.user_id = id
            next();
        }
        else{
            res.redirect("back")
        }
    })
    
}


module.exports = {
    isLogin,
    isLogOut,
    verifyUser,
    truckUserMatching
}