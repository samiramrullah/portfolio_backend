const express = require('express')
const { Resend } = require('resend')
const router = express.Router();

router.post('/', (req, res) => {
    const resend = new Resend('re_RcAYDAm5_NREjYaVHTBfyLm7q2PMT5QvL');

    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'iamsamir855@gmail.com',
        subject: 'Hello World',
        html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    res.status(200).json({
        status:true,
        message:"Email Successfull Sent"
    })
})

module.exports = router;