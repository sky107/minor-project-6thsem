/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 const mongoose = require("mongoose"),
 Schema = mongoose.Schema;

/**
* User schema
*/
const ActivitySchema = new mongoose.Schema(
 {
   deviceId:String,
   ipAddress:String,
   deviceOwnerDocId:mongoose.Schema.Types.ObjectId,
 },
 { timestamps: true }
);
module.exports = mongoose.model("Activity", ActivitySchema);
