/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 const mongoose = require("mongoose"),
 Schema = mongoose.Schema;

/**
* User schema
*/
const DeviceSchema = new mongoose.Schema(
 {
   deviceId:String,
   latitude:String,
   longitude:String,
   ownerName:String,
   ownerEmail:String,
   status:Number
 },
 { timestamps: true }
);
module.exports = mongoose.model("Device", DeviceSchema);
