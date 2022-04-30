/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 const express = require("express");
 const jwt = require("jsonwebtoken");
 const router = express.Router();
 const UserModel = require("../models/users.model");
const {decodeJwtToken,reversedNum}=require('../utils/helpers')
 const DeviceModel=require('../models/devices.model')

 router.get('/devices',async (req,res,next)=>{
    const {latitude,longitude}=req.body;

    const {token}=req.session;
    const {id:userId}=decodeJwtToken(token);
    const time = new Date().getTime();
    const id = reversedNum(time);
    const deviceId= "DC" + reversedNum(parseInt(id + Math.random() * 100));
    const tokenData=decodeJwtToken(token);
     const response= await  DeviceModel.create({
         deviceId,
         latitude,
         longitude,
         ownerEmail:tokenData.email,
         ownerName:tokenData.name,
         ownerId:userId.toString(),
         status:0
    })
    console.log(userId);
    const user=await UserModel.findById(userId.toString());
    console.log(user);
    user.devices.push(response._id.toString());
    await user.save();

    res.json({
        success:true,
        data:response
    })

 })

 router.get('/devices/count',async(req,res,next)=>{

    try{
    const {token}=req.session;
    const {id:userId}=decodeJwtToken(token);
    const time = new Date().getTime();
    const id = reversedNum(time);
    const deviceId= "DC" + reversedNum(parseInt(id + Math.random() * 100));
    const tokenData=decodeJwtToken(token);
    const devices=await DeviceModel.find({ownerId:userId});
    let a=0,ia=0;
    for( let d of devices){
        switch (d.status){
            case 0:
                ia++;
                break;
            case 1:
                a++;
                break;
            default:
                ia++;
            break;
        }
    }

    console.log("DEVICES",devices);


    res.json({
        success:true,
        data:{
            total:devices.length,
            active:a,
            inActive:ia
        }
    })

}
catch(err){
    res.json({success:false,
        message:err.toString()
    })
}
 })



 module.exports=router;