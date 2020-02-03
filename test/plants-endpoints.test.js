const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Plants Endpoints',function(){
    let db 

    const testPlants = helpers.makePlantsArray()
    const testPlant = testPlants[0]

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

    describe(`GET /api/plants`,()=>{
        context(`Given no plants`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                    .get('/api/plants')
                    .expect(200,[])
            })
        })

        context(`Given there are plants in the database`,()=>{
            beforeEach('insert plants',()=>
                helpers.seedPlants(db, testPlants)
            )
            //DOESNT PASS 
            it(`responds with 200 and all of the plants`,()=>{
                const expectedPlants = testPlants
                return supertest(app)
                    .get('/api/plants')
                    .expect(200,expectedPlants)
            })
        })

        context(`Given an XSS attack plant`,()=>{
            const {
                maliciousPlant,
                expectedPlant,
            } = helpers.makeMaliciousPlant()

            beforeEach('insert malicious user', () => {
                return helpers.seedMaliciousPlant(
                  db,
                  maliciousPlant
                )
            })

            it('removes XSS attack content',()=>{
                return supertest(app)
                    .get(`/api/plants`)
                    .expect(200)
                    .expect(res=>{
                        expect(res.body[0].name).to.eql(expectedPlant.name)
                        expect(res.body[0].watering_directions).to.eql(expectedPlant.watering_directions)
                        expect(res.body[0].img).to.eql(expectedPlant.img)
                    })
            })

        })

    })

    describe(`POST /api/plants`, () => {
        
        context(`Plant Validation`, () => {
          beforeEach('insert plants', () =>
            helpers.seedPlants(
              db,
              testPlants,
            )
          )
    
          const requiredFields = ['name','water_every','watering_directions','img']
    
          requiredFields.forEach(field => {
            const registerAttemptBody = {
              name: 'test name',
              water_every: 'test water_every',
              watering_directions: 'test watering_direction',
              img: 'test img',
            }
    
            it(`responds with 400 required error when '${field}' is missing`, () => {
              delete registerAttemptBody[field]
    
              return supertest(app)
                .post('/api/plants')
                .send(registerAttemptBody)
                .expect(400, {
                  error: `Missing '${field}' in request body`,
                })
            })
          })
    
        })
        context(`Happy path`, () => {
          it(`responds 201, serialized plant`, () => {
            const newPlant = {
                name: 'test plant name',
                water_every: 20,
                watering_directions: 'test watering_direction',
                img: 'test img',
            }
            return supertest(app)
              .post('/api/plants')
              .send(newPlant)
              .expect(201)
              .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.name).to.eql(newPlant.name)
                expect(res.body.water_every).to.eql(newPlant.water_every)
                expect(res.body.watering_directions).to.eql(newPlant.watering_directions)
                expect(res.body.img).to.eql(newPlant.img)
                expect(res.headers.location).to.eql(`/api/plants/${res.body.id}`)
              })
              .expect(res =>
                db
                  .from('drip_drop_plants')
                  .select('*')
                  .where({ id: res.body.id })
                  .first()
                  .then(row => {
                    expect(row.name).to.eql(newPlant.name)
                    expect(row.water_every).to.eql(newPlant.water_every)
                    expect(row.watering_directions).to.eql(newPlant.watering_directions)
                    expect(row.img).to.eql(newPlant.img)
                  })
              )
          })
        })
      
    })

})