const express = require('express')
const { Resend } = require('resend')
const router = express.Router();

router.post('/', (req, res) => {
    const { name,
        email,
        subject,
        message}= req.body;    
    const resend = new Resend(process.env.RESEND_API_KEY);
    resend.emails.send({
        from: email,
        to: 'samiramrullah@gmail.com',
        subject: subject,
        html: message
    });
    res.status(200).json({
        status:true,
        message:"Email Successfull Sent"
    })
})

router.get('/',(res,req)=>{
    res.status(200).json({
        status:true,
        message:"Okay"
    })
})

module.exports = router;