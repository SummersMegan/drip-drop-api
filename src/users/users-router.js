const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter 
    .route('/')
    // get all reminders from the drip_drop_users table
    .get((req,res,next)=>{
        UsersService.getAllUsers(req.app.get('db'))
            .then(users => {
                res.json(users.map(UsersService.serializeUser))
            })
            .catch(next)
    })
    // creates a new user
    .post(jsonBodyParser,(req,res,next)=>{
        const { first_name, last_name, password, email, phone_number } = req.body


        for (const field of ['first_name','last_name','password','email','phone_number'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body` 
                })

        const passwordError = UsersService.validatePassword(password)

        if(passwordError)
            return res.status(400).json({error:passwordError})

        UsersService.hasUserWithEmail(
            req.app.get('db'),
            email
        )
            .then(hasUserWithEmail=>{
                if(hasUserWithEmail)
                    return res.status(400).json({error:`There is already an account associated with this email`})
            
                return UsersService.hashPassword(password)
                    .then(hashedPassword=>{
                        const newUser = {
                            first_name,
                            last_name, 
                            password: hashedPassword,
                            email,
                            phone_number
                        }

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user=>{
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })

module.exports = usersRouter