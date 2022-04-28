const app = require("express")();
const bodyParser = require("body-parser");
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

var serviceAccount = require("./motioncloudwatch-firebase-adminsdk-5m5xw-b872807fb5.json");
const { json } = require("body-parser");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();
var jsonParser = bodyParser.json();


app.get('/test',jsonParser,(req,res)=>{
  const {email}=req.query;
  console.log(email);
  res.json({
    success:true
  })
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

app.listen(process.env.PORT || 3000, () => console.log("OK"));
