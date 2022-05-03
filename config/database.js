/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 require("dotenv").config();
 var dbConn ="mongodb+srv://testdb:SRsObuQ1IKptqkOd@cluster0.v48mv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
 // console.log(dbConn);
 module.exports = {
   secret: "expressapitest",
   dbConnection: dbConn,
 };
 