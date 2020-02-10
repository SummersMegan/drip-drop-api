const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Plants Endpoints',function(){
    let db 

    const testReminders = helpers.makeRemindersArray()
    const testPlants= helpers.makePlantsArray()
    const testUsers = helpers.makeUsersArray()

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
      })
    
    after('disconnect from db', () => db.destroy())
    
    before('cleanup', () => helpers.cleanTables(db))
    
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/sms`,()=>{
        context(`Given no sms's`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                    .get('/api/sms')
                    .expect(200,[])
            })
        })

        context(`Given there are plants in the database`,()=>{
            
            beforeEach('insert plants',()=>
                helpers.seedPlants(db, testPlants)
            )

            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers),
            )

            beforeEach('insert reminders',()=>
                helpers.seedReminders(db, testReminders)
            )
            
            it(`responds with 200 and all of the sms's`,()=>{
                const expectedSms = helpers.makeExpectedSmsArray()
                return supertest(app)
                    .get('/api/sms')
                    .expect(200,expectedSms)
            })
        })

    })

})