const express = require('express')
const path = require('path')
const RemindersService = require('./reminders-service')

const remindersRouter = express.Router()
const jsonBodyParser = express.json()


remindersRouter 
    .route('/')
    .post(jsonBodyParser, (req,res,next)=>{
        const {plant_id, user_id, remind_on} = req.body
        const newReminder = {plant_id, user_id, remind_on}

        RemindersService.postReminder(
            req.app.get('db'),
            newReminder
        )
            .then(reminder => {
                res
                    .status(201)
                    //.location(path.posix.join(req.originalUrl,`${reminder.id}`))
                    .json(newReminder)
            })
            .catch(next)
    })

remindersRouter 
    .route('/users/:user_id')
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
    /*.delete((req,res,next)=>{
        RemindersService.deleteReminder(
            req.app.get('db'),
            req.params.user_id
        )
            .then(reminders=> {
                res.json(plants.map(RemindersService.serializeReminder))
            })
            .catch(next)
    })
    .patch(jsonBodyParser,(req,res,next)=>{
        const {plant_id,user_id} = req.body
        const reminderToUpdate = {plant_id,user_id}

        RemindersService.updateReminder(
            req.app.get('db'),
            req.params.reminder_id
        )
    })*/

    remindersRouter 
    .route('/:reminder_id')
    .patch(jsonBodyParser,(req,res,next)=>{
        const {plant_id,user_id,remind_on} = req.body
        const reminderToUpdate = {plant_id,user_id,remind_on}

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