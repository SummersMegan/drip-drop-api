const SmsService = {
    //gets the information necessary to send sms message using twilio
    getAllSms(db){
        return db   
            .from('drip_drop_reminders AS reminder')
            .select(
                'reminder.id AS reminder_id',
                'plant.name AS plant_name',
                'plant.water_every AS water_every',
                'user.phone_number AS phone_number',
                'reminder.remind_on AS reminder_date'
            )
            .join('drip_drop_plants AS plant','plant.id','reminder.plant_id')
            .join('drip_drop_users AS user','user.id','reminder.user_id')
    },
    serializeSms(sms){
        return {
            reminder_id: sms.reminder_id,
            plant_name: sms.plant_name,
            water_every: sms.water_every,
            phone_number: sms.phone_number,
            reminder_date: sms.reminder_date.toISOString().split('T')[0]
        }
    }
}

module.exports = SmsService