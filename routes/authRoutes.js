/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 const express = require("express");
 const jwt = require("jsonwebtoken");
 const router = express.Router();
 const UserModel = require("../models/users.model");
const { route } = require("./activityRoutes");
const bcrypt=require('bcrypt');
const { getJwtToken } = require("..//utils/helpers");


router.post('/register',async (req,res,next)=>{
  var {
    name,
    email,
    password,
    mobile,
    admin = false,
  } = req.body;

 
  let user = await UserModel.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({
      success: false,
      data: {
        message: "User Already Exists"
      },
    });


  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      console.log(hashedPassword);
      const user = new UserModel({
        name: name,
        email: email,
        password: hashedPassword,
        mobile: mobile,
        admin: admin,
      });
      user.save();
    })
    .then((resp) => {
      res.status(201).json({
        sucess: true,
        data: {
          name: name,
          email: email,
          password: null,
          mobile: mobile,
          admin: admin,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(503);
      return next(err);
    });

})

 router.post('/login',(req,res,next)=>{
   
  
    const { email, password } = req.body;
  
    let userTobeLogin;
  
    console.log(email, password);
  
    UserModel.findOne({ email: email })
      .select([
        "name",
        "email",
        "admin",
        "password",
      ])
      .then((user) => {
        if (user) {
          userTobeLogin = user;
          console.log(user.password);
          return bcrypt.compare(password, user.password);
        } else {
          console.log(user);
          throw new Error("User Not Found");
        }
      })
      .then((result) => {
        console.log(userTobeLogin);
        const token = getJwtToken({
          id: userTobeLogin._id.toString(),
          name: userTobeLogin.name,
          email: userTobeLogin.email,
          admin: userTobeLogin.admin,
        },'12hr');
  
        if (result) {
          req['session'].token=token;
          res.json({
            sucess: true,
            data: {
              name: userTobeLogin.name,
              email: userTobeLogin.email,
              admin: userTobeLogin.admin,
              token: token,
            },
          });
        } else {
          res.json({
            success: false,
            data: {
              message:"INVALID CREDENTIALS"
            },
          });
        }
      })
      .catch((err) => {
        res.json({
          success: false,
          data: {
            message: err.toString(),
          },
        });
      });
 })
router.get('/logout',(req,res,next)=>{
  req['session'].destroy();
  res.json({
    success:true,
    message:"LOGOUT SUCCESSFUL"
  })
})


 module.exports=router;