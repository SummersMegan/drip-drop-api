const express = require('express')
const path = require('path')
const RemindersService = require('./reminders-service')

const remindersRouter = express.Router()
const jsonBodyParser = express.json()


remindersRouter 
    .route('/')
    .post(jsonBodyParser, (req,res,next)=>{
        const {plant_id, user_id} = req.body
        const newReminder = {plant_id, user_id}

        RemindersService.postReminder(
            req.app.get('db'),
            newReminder
        )
            .then(reminder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl,`${reminder.id}`))
                    .json()
            })
            .catch(next)
    })

/*remindersRouter 
    .route('/:user_id')
    .get((req,res,next)=>{
        RemindersService.getByUserId(
            req.app.get('db'),
            req.params.user_id
        )
            .then(plants => {
                res.json(plants.map(RemindersService.serializePlant))
            })
            .catch(next)
    })
    .delete((req,res,next)=>{
        RemindersService.deleteReminder(
            req.app.get('db'),
            req.params.user_id
        )
            .then(reminders=> {
                res.json(plants.map(RemindersService.serializeReminder))
            })
            .catch(next)
    })*/

remindersRouter 
    .route('/:plant_id/:user_id')
    .delete((req,res,next)=>{
        RemindersService.deleteReminder(
            req.app.get('db'),
            req.params.plant_id,
            req.params.user_id
        )
            .then(()=> {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = remindersRouter