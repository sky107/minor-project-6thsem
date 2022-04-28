/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 let nodemailer = require("nodemailer");

 
 module.exports.GmailTransport = nodemailer.createTransport({
   service: "gmail",
   auth: {
     user: "siddharthsk101@gmail.com",
     pass: "sidiscrazy",
   },
 });
 