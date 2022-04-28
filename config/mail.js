/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 let nodemailer = require("nodemailer");

 
 module.exports.GmailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
   auth: {
     user: "siddharthsk101@gmail.com",
     pass: "sidiscrazy",
   },
 });
 