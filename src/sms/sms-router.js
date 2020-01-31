const express = require('express')
const path = require('path')
const SmsService = require('./sms-service')

const smsRouter = express.Router()

smsRouter 
    .route('/')
    .get((req,res,next)=>{
        SmsService.getAllSms(req.app.get('db'))
            .then(sms => {
                res.json(sms.map(SmsService.serializeSms))
            })
            .catch(next)
    })

module.exports = smsRouter