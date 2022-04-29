/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 const mongoose = require("mongoose"),
 Schema = mongoose.Schema;

/**
* User schema
*/
const UserSchema = new mongoose.Schema(
 {
   name: {
     type: String,
     trim: true,
     required: "User name is required",
     minlength: [
       5,
       "The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH})",
     ],
     validate: [validateUsername, "Please supply a valid user name"],
   },
   email: {
     type: String,
     trim: true,
     lowercase: true,
     unique: true,
     required: "Email address is required",
     match: [
       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
       "Please supply a valid email address",
     ],
   },
   password: {
     type: String,
     required: "Password is reqiured",
     select: false,
   },
   mobile: {
     type: String,
   },
   admin: {
     type: Boolean,
     required: "Please confirm wheather user is admin or a customer",
   },
   devices: [
     {
       type: Schema.Types.ObjectId,
       ref: "Device",
     },
   ],
 },
 { timestamps: true }
);

function validateUsername(name) {
 // we just require the user name begins with a letter (only for demomstration purposes ...)
 var re = /^[A-Z,a-z].*$/;
 return re.test(name);
}

module.exports = mongoose.model("User", UserSchema);
