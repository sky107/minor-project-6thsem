/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 const express = require("express");
 const jwt = require("jsonwebtoken");
 const router = express.Router();
 const UserModel = require("../models/users.model");




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
        if (user !== null && user.status === 3) {
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
        });
  
        if (result) {
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



 module.exports=router;