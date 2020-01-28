// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);

const fetch = require('node-fetch');


const PlantsssService = require('./plants')
const knex = require('knex')
const app = require('./src/app')
const { PORT, DB_URL } = require('./src/config')





/*let plants = fetch('http://localhost:8025/api/plants/')
    .then(function(res){return res.json()})
    .then(json=>json)

console.log(plants)*/






    const db = knex({
        client: 'pg',
        connection: DB_URL,
      })
      
      app.set('db', db)
      
      

      const plants = PlantsssService.getAllPlants(db)

      console.log(plants)
          

/*client.messages
  .create({
     body: plantName,
     from: '', //E.164 formatting
     to: ''
   })
  .then(message => console.log(message.sid));
*/

