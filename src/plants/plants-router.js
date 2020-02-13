const express = require('express')
const path = require('path')
const PlantsService = require('./plants-service')

const plantsRouter = express.Router()
const jsonBodyParser = express.json()

plantsRouter 
    .route('/')
    // gets all plants from drip_drop_plants table
    .get((req,res,next)=>{
        PlantsService.getAllPlants(req.app.get('db'))
            .then(plants => {
                res.json(plants.map(PlantsService.serializePlant))
            })
            .catch(next)
    })
    // creates a new plant
    .post(jsonBodyParser,(req,res,next)=>{
        const { name, water_every, watering_directions, img } = req.body
        const newPlant = { name, water_every, watering_directions, img }

        for (const field of ['name','water_every','watering_directions','img'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body` 
                })

        return PlantsService.postPlant(
            req.app.get('db'),
            newPlant
        )
            .then(plant=>{
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${plant.id}`))
                    .json(PlantsService.serializePlant(plant))
            })
            .catch(next)
    })

module.exports = plantsRouter