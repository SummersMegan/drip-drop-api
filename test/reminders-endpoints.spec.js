const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Reminders Endpoints',function(){
    let db 

    const testReminders = helpers.makeRemindersArray()
    const testReminder = testReminders[0]
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

    describe(`GET /api/reminders`,()=>{
        context(`Given no reminders`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                    .get('/api/reminders')
                    .expect(200,[])
            })
        })

        context(`Given there are reminders in the database`,()=>{
            beforeEach('insert plants',()=>
                helpers.seedPlants(db, testPlants)
            )

            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers),
            )
            beforeEach('insert reminders',()=>
                helpers.seedReminders(db, testReminders)
            )

            it(`responds with 200 and all of the reminders`,()=>{
                const expectedReminders = testReminders.map(reminder=>({
                    id: reminder.id,
                    plant_id: reminder.plant_id,
                    user_id: reminder.user_id,
                    remind_on: reminder.remind_on
                }))
                return supertest(app)
                    .get('/api/reminders')
                    .expect(200,expectedReminders)
            })
        })
    })

    describe(`POST /api/reminders`,()=>{
        context(`reminder validation`,()=>{
            beforeEach('insert plants',()=>
                helpers.seedPlants(db, testPlants)
            )

            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers),
            )
            beforeEach('insert reminders',()=>
                helpers.seedReminders(db, testReminders)
            )

            const requiredFields = ['plant_id','user_id','remind_on']

            requiredFields.forEach(field => {
                const reminderAttemptBody = {
                    plant_id:1,
                    user_id:2,
                    remind_on: '2020-02-02T00:00:00.000Z'
                }
        
                it(`responds with 400 required error when '${field}' is missing`, () => {
                  delete reminderAttemptBody[field]
        
                  return supertest(app)
                    .post('/api/reminders')
                    .send(reminderAttemptBody)
                    .expect(400, {
                      error: `Missing '${field}' in request body`,
                    })
                })
              })

        })

        context(`Happy path`, () => {
            
            beforeEach('insert plants',()=>
                helpers.seedPlants(db, testPlants)
            )
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers),
            )
            beforeEach('insert reminders',()=>
                helpers.seedReminders(db, testReminders)
            )
            
            it(`responds 201, serialized reminder`, () => {
              const newReminder = {
                id: 1,
                plant_id:1,
                user_id:2,
                remind_on: '2020-02-02T00:00:00.000Z'
              }
              return supertest(app)
                .post('/api/reminders')
                .send(newReminder)
                .expect(201)
                .expect(res => {
                  expect(res.body).to.have.property('id')
                  expect(res.body.plant_id).to.eql(newReminder.plant_id)
                  expect(res.body.user_id).to.eql(newReminder.user_id)
                  expect(res.body.remind_on).to.eql(newReminder.remind_on)
                })
                .expect(res =>
                  db
                    .from('drip_drop_reminders')
                    .select('*')
                    .where({ id: res.body.id })
                    .first()
                    .then(row => {
                      expect(row.plant_id).to.eql(newReminder.plant_id)
                      expect(row.user_id).to.eql(newReminder.user_id)
                      expect(row.remind_on).to.eql(newReminder.remind_on)      
                    })
                    .then(compareMatch => {
                      expect(compareMatch).to.be.true
                    })
                )
            })
          })
    })


})