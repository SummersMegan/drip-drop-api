const express = require('express')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter 
    .route('/')
    .get((req,res,next)=>{
        UsersService.getAllUsers(req.app.get('db'))
            .then(users => {
                res.json(users.map(UsersService.serializeUser))
            })
            .catch(next)
    })
    .post(jsonBodyParser,(req,res,next)=>{
        const {first_name,last_name,password,email,phone_number} = req.body
        const newUser = {first_name,last_name,password,email,phone_number}

        return UsersService.createNewUser(
            req.app.get('db'),
            newUser
        )
            .then(user=>{
                res 
                    .status(201)
                    //.location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(UsersService.serializeUser(user))
            })
            .catch(next)
    })

usersRouter 
    .route('/:user_id')
    .delete()

module.exports = usersRouter