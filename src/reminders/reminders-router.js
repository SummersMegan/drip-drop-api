const express = require('express')
const path = require('path')
const RemindersService = require('./reminders-service')

const remindersRouter = express.Router()
const jsonBodyParser = express.json()

remindersRouter 
    .route('/')
    // get all reminders from drip_drop_reminders table
    .get((req,res,next)=>{
        RemindersService.getAllReminders(req.app.get('db'))
            .then(reminders => {
                res.json(reminders.map(RemindersService.serializeReminder))
            })
            .catch(next)
    })
    // posts new reminder 
    .post(jsonBodyParser, (req,res,next)=>{
        const {plant_id, user_id, remind_on} = req.body
        const newReminder = {plant_id, user_id, remind_on}

        for (const field of ['plant_id','user_id','remind_on'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        RemindersService.postReminder(
            req.app.get('db'),
            newReminder
        )
            .then(reminder => {
                res
                    .status(201)
                    .json(RemindersService.serializeReminder(reminder))
            })
            .catch(next)
    })

remindersRouter 
    .route('/users/:user_id')
    // returns plant information based on reminders in the db, specific to the user
    .get((req,res,next)=>{
        RemindersService.getByUserId(
            req.app.get('db'),
            req.params.user_id
        )
            .then(plants => {
                res.json(plants.map(RemindersService.serializeUsersPlant))
            })
            .catch(next)
    })

remindersRouter 
    .route('/:reminder_id')
    // updates a reminder
    .patch(jsonBodyParser,(req,res,next)=>{
        const {plant_id,user_id,remind_on} = req.body
        const reminderToUpdate = {plant_id,user_id,remind_on}

        const numberOfValues = Object.values(reminderToUpdate).filter(Boolean).length
        if(numberOfValues === 0)
            return res.status(400).json({
                error:{
                    message: `Request body must contain either 'plant_id', 'user_id' or 'remind_on'`
                }
            })

        RemindersService.updateReminder(
            req.app.get('db'),
            req.params.reminder_id,
            reminderToUpdate
        )
            .then(numRowsAffected=>{
                res.status(204).end()
            })
            .catch(next)
    })

remindersRouter 
    .route('/plants/:plant_id/users/:user_id')
    //deletes reminder based on plant_id and user_id
    .delete((req,res,next)=>{
        RemindersService.deleteReminder(
            req.app.get('db'),
            req.params.plant_id,
            req.params.user_id
        )
            .then(reminder=> {
                res
                    .status(200)
                    .json([{"plant":"3"}])
            })
            .catch(next)
    })

module.exports = remindersRouter