/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 const express = require("express");
 const jwt = require("jsonwebtoken");
const activityModel = require("../models/activity.model");
const devicesModel = require("../models/devices.model");
 const router = express.Router();
 const UserModel = require("../models/users.model");
 const {decodeJwtToken,reversedNum}=require('../utils/helpers')
 const { GmailTransport } = require("../config/mail");
const sendSms = require("../config/sms");





 router.get('/activity',async(req,res,next)=>{
    

    const {token}=req.session;
    const {id:userId}=decodeJwtToken(token);
    const time = new Date().getTime();
    const id = reversedNum(time);
    const deviceId= "DC" + reversedNum(parseInt(id + Math.random() * 100));
    const tokenData=decodeJwtToken(token);

    const list=await activityModel.find({deviceOwnerId:userId});

    res.json({
        success:true,
        data:list
    })

 })

 router.post('/activity',async(req,res,next)=>{

    const {token}=req.session;
    const {id:userId}=decodeJwtToken(token);
    const time = new Date().getTime();
    const id = reversedNum(time);
    // const deviceId= "DC" + reversedNum(parseInt(id + Math.random() * 100));
    const tokenData=decodeJwtToken(token);
    // might be need to remove authentication due to low processing of nodemcu
    console.log(tokenData);
    
        const {deviceId,ipAddress}=req.body;

        const device=await devicesModel.find({deviceId:deviceId,ownerEmail:tokenData.email});
        if(device.length==[]){
            return res.json({
                success:false,
                message:"Unauthorized action"
            })
        }
        console.log(device);


       const response=await  activityModel.create({
            ipAddress,
            deviceId,
            deviceOwnerDocId:tokenData.id.toString()
        });

        const email=tokenData.email;


        const msg = {
            to: email, // Change to your recipient
            from: '"CloudMotionwatch" siddharthsk101@gmail.com', // Change to your verified sender
            subject: `Motion alert ${new Date()}`,
            html: `<strong>Some Activity has been detected with you CloudMotionwatch Devices, please check it</strong>`,
          }
        
        const DID='CW3472834373';
          console.log("HI")
          sendSms(9713063026,`
          Some activity has been detected with you DEVICE ID : ${DID} at ${new Date()}.
          `);
        
          GmailTransport.sendMail(msg)
          .then(resp=>{
            console.log(resp);
            res.json({
              success:true
            });
          })
          .catch(err=>{
            console.log(err);
            res.json({
              success:false
            });
          })

    
    //    res.json({
    //        success:true,
    //        data:response
    //    })
 })



 module.exports=router;