
const User = require("../models/user");

const { check , validationResult} = require('express-validator');

var jwt = require('jsonwebtoken');

var expressJwt = require('express-jwt');

exports.signup = (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
      const user = new User(req.body)
      user.save((err,user) => {
          if(err){
              return res.status(400).json({
                  err: "Not able to send User in DB"
              })
          }
          res.json({
              name: user.name,
              email: user.email,
              id: user._id
          });
      })
 };

exports.signin = (req,res) => {
    const errors = validationResult(req);
    const {email,password} = req.body;
    
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findOne({email} , (err,user)=>{
        //if our user is not in the database
        if(err || !user){
            return res.status(400).json({
                error: "User email doesn't exist"
            })
        }
    
        //if the user enters correct password
        if(!user.autheticate(password)){
           return res.status(401).json({
               error: "email and password do not match"
           })
        }

        //if all things are Ok now we have to make a token and put it into the cookie
        var token = jwt.sign( {_id: user._id} , process.env.SECRET);
        
        res.cookie("token",token, {expire: new Date() + 9999});

        //send response to the frontend
        const { _id,name,email,role } = user;
        return res.json({ token , user: {_id,name,email,role}});
   });

};

exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
       message: "User Signout Succesfully"
    });
};


//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"   
})


//custom middlewares
exports.isAuthenticated = (req,res,next) => {
    let checker = false
    checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED11"
        })
    }

    next();
}

exports.isAdmin = (req,res,next) => {
   
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "you are not an admin, Access Denied"
        })
    }

    next();
}
