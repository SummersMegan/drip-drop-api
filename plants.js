const PlantsService = require('./src/plants/plants-service')


const PlantsssService = {
    getAllPlants(db){
        return db   
            .from('drip_drop_plants')
            .select('*')
            .then(plants=>{
                return plants.map(PlantsService.serializePlant)
            })
            .finally(()=>{
                db.destroy();
            })
    }
}

module.exports = PlantsssService