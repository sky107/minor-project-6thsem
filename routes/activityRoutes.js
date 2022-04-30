/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 const express = require("express");
 const jwt = require("jsonwebtoken");
const activityModel = require("../models/activity.model");
 const router = express.Router();
 const UserModel = require("../models/users.model");

 router.get('/activity',async(req,res,next)=>{
    
    const list=await activityModel.find({});

    res.json({
        success:true,
        data:list
    })

 })

 router.post('/activity',async(req,res,next)=>{
        const {deviceId,ipAddress}=req.body;
       await  activityModel.create({
            ipAddress,
            deviceId
        });

        res.sendStatus(201);
 })



 module.exports=router;