
const accountSid = 'AC73d27773c5a6a2d30428e0e756348029';
const authToken = '38d2f7e8f1991e321362fb3902c661d0';

const sendSms = (phone, message) => {
  const client = require('twilio')(accountSid, authToken);
  console.log(phone,message);
  client.messages
    .create({
       body: message,
       from: '+17622402744',
       to: '+91'+phone
     })
    .then(message => console.log(message.sid))
    .catch(err=>console.log("ERR",err));
}

module.exports = sendSms;