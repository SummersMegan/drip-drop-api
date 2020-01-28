const express = require('express')
const PlantsService = require('./plants-service')

const plantsRouter = express.Router()

plantsRouter 
    .route('/')
    .get((req,res,next)=>{
        PlantsService.getAllPlants(req.app.get('db'))
            .then(plants => {
                res.json(plants.map(PlantsService.serializePlant))
            })
            .catch(next)
    })

module.exports = plantsRouter