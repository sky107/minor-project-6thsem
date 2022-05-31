const app = require("express")();
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");


var admin = require("firebase-admin");
var database = require("./config/database");
var authRoutes = require("./routes/authRoutes");
var activityRoutes = require("./routes/activityRoutes");
var deviceRoutes=require('./routes/deviceRoutes');
var serviceAccount = require("./motioncloudwatch-firebase-adminsdk-5m5xw-b872807fb5.json");
const { json } = require("body-parser");
const { GmailTransport } = require("./config/mail");
const sendSms = require("./config/sms");



const session=require('express-session');
const devicesModel = require("./models/devices.model");
const activityModel = require("./models/activity.model");
// const MONGODB_URI='mongodb+srv://testdb:JqfMyCWTR8YQ5p4n@cluster0.v48mv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MongoDBStore=require('connect-mongodb-session')(session);
const store= new MongoDBStore({uri:String(database.dbConnection),collection:'sessions'});
app.use(session({secret:'siddharth_kumaryadav',resave:false,saveUninitialized:false,store:store}));





admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();
var jsonParser = bodyParser.json();


app.get('/test',jsonParser,async(req,res,next)=>{
  const {did='1234'}=req.query;
  

  const rs=await devicesModel.find({deviceId:did});
  console.log(rs);
  const email=rs.ownerEmail || 'siddharthsk1234@gmail.com';
  const name=rs.ownerName;
  const phone=rs.ownerPhone;

  console.log(email);
  const msg = {
    to: email, // Change to your recipient
    from: '"CloudMotionwatch" siddharthsk101@gmail.com', // Change to your verified sender
    subject: `Motion alert ${new Date()}`,
    html: `<strong>Some Activity has been detected with you CloudMotionwatch Device ${did}, please check it</strong>`,
  }

  

  // const activity= await activityModel.create({
  //   deviceId:did,
  //  ipAddress:'12.232.32333.3',
  //  deviceOwnerDocId:'2Adws22dw',
  // })

  z
  sendSms(9713063026,`
  Some activity has been detected with you DEVICE ID : ${did} at ${new Date()}.
  `);
  
  res.json({
    success:true
  });

  GmailTransport.sendMail(msg)
  .then(resp=>{
    console.log(resp);
  
  })
  .catch(err=>{
    console.log(err);
    res.json({
      success:false
    });
  })

// next();
})
app.post("/send-notification", jsonParser, async (req, res, next) => {
  var { email } = req?.body;
 
  if(!email){
   return res.json({
      success:false,
      message:"Invalid Email"
    })
  }


console.log("EMAIL",email);
console.log("BODY",req.body);
  const snapshot = await db
    .collection("AppUsers")
    .where("email", "==", email)
    .get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }
  snapshot.forEach((doc) => {
    const { fcmToken } = doc.data();

    var options = {
      priority: "normal",
      timeToLive: 60 * 60,
      
    };

    var payload = {
      notification: {
        title: "Account Deposit",
        body: "A deposit to your savings account has just cleared.",
      },
      data: {
        account: "Savings",
        balance: "$3020.25",
      },
    };
    console.log("FCM",fcmToken)
    admin
      .messaging()
      .sendToDevice(fcmToken, payload, options)
      .then(function (response) {
        console.log("Successfully sent message:", response.results);
      })
      .catch(function (error) {
        console.log("Error sending message:", error);
      });

    res.json({
      message: "SUCCESS",
    });
  });
});

const authMiddlware=(req,res,next)=>{
  if(req.session.token){
    next();
  }else
   res.json({
    success:false,
    message:"Unauthorized"
  })
}
app.use(jsonParser,authRoutes);
app.use(jsonParser,authMiddlware,deviceRoutes);
app.use(jsonParser,authMiddlware,activityRoutes);


mongoose
  .connect(database.dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response)=>{
    app.listen(process.env.PORT || 3000, () => console.log("OK"));
  })
  .catch((err) => {
    if (err.code === "ECONNREFUSED")
      console.log(
        "Failed to Connect with MongoDB Please check your Internet Connection"
      );
    else console.log("ERORR", err);
  });

