const app=require('express')();




app.post('/send-notification',(req,res,next)=>{

    console.log(req.body);

    res.send({
        message:"RECEIVED"
    })

})

app.listen(process.env.PORT || 3000,()=>console.log("OK"))