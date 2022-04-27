const app=require('express')();




app.post('/send-notification',(req,res,next)=>{

    console.log(req.body);

})

app.listen(3000,()=>console.log("OK"))