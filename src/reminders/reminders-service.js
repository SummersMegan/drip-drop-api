const xss = require('xss')

const RemindersService = {
    getByUserId(db,user_id){
        return db   
            .from('drip_drop_plants AS plant')
            .select(
                'plant.name',
                'plant.water_every',
                'plant.watering_directions',
                'plant.img'
            )
            .join('drip_drop_reminders AS reminders','plant.id','reminders.plant_id')
            .where('reminders.user_id',user_id)
    },
    postReminder(db,newReminder){
        return db 
            .insert(newReminder)
            .into('drip_drop_reminders')
            .returning('*')
    },
    deleteReminder(db,plant_id,user_id){
        return db   
            .from('drip_drop_reminders AS reminders')
            .where('reminders.plant_id',plant_id)
            .where('reminders.user_id',user_id)
            .delete()
    },
    serializePlant(plant){
        return {
            id: plant.id,
            name: xss(plant.name),
            water_every: plant.water_every,
            watering_directions: xss(plant.watering_directions),
            img: xss(plant.img)
        }
    },
    serializeReminder(reminder){
        return {
            id: reminder.id,
            plant_id: reminder.plant_id,
            user_id: reminder.user_id
        }
    }
}

module.exports = RemindersService