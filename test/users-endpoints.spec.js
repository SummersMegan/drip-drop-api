const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints',function(){
    let db 

    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]

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

    describe(`GET /api/users`,()=>{
        context(`Given no users`,()=>{
            it(`responds with 200 and an empty list`,()=>{
                return supertest(app)
                    .get('/api/users')
                    .expect(200,[])
            })
        })

        context(`Given there are users in the database`,()=>{
            beforeEach('insert users',()=>
                helpers.seedUsers(db, testUsers)
            )
            it(`responds with 200 and all of the users`,()=>{
                const expectedUsers = testUsers.map(user=>({
                    id: user.id,
                    first_name:user.first_name,
                    last_name:user.last_name,
                    email:user.email,
                    phone_number:user.phone_number
                }))
                return supertest(app)
                    .get('/api/users')
                    .expect(200,expectedUsers)
            })
        })

        context(`Given an XSS attack user`,()=>{
            const {
                maliciousUser,
                expectedUser,
            } = helpers.makeMaliciousUser()

            beforeEach('insert malicious user', () => {
                return helpers.seedMaliciousUser(
                  db,
                  maliciousUser
                )
            })

            it('removes XSS attack content',()=>{
                return supertest(app)
                    .get(`/api/users`)
                    .expect(200)
                    .expect(res=>{
                        expect(res.body[0].first_name).to.eql(expectedUser.first_name)
                        expect(res.body[0].last_name).to.eql(expectedUser.last_name)
                    })
            })

        })
    })

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
          beforeEach('insert users', () =>
            helpers.seedUsers(
              db,
              testUsers,
            )
          )
    
          const requiredFields = ['password', 'first_name','last_name','email','phone_number']
    
          requiredFields.forEach(field => {
            const registerAttemptBody = {
              first_name: 'test first_name',
              last_name: 'test last_name',
              password: 'test password',
              email: 'test email',
              phone_number: 'test phone_number',
            }
    
            it(`responds with 400 required error when '${field}' is missing`, () => {
              delete registerAttemptBody[field]
    
              return supertest(app)
                .post('/api/users')
                .send(registerAttemptBody)
                .expect(400, {
                  error: `Missing '${field}' in request body`,
                })
            })
          })
    
          it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
            const userShortPassword = {
                first_name: 'test first_name',
                last_name: 'test last_name',
                password: 'abc',
                email: 'foo@gmail.com',
                phone_number: '7739514325',
            }
            return supertest(app)
              .post('/api/users')
              .send(userShortPassword)
              .expect(400, { error: `Password must be longer than 8 characters` })
          })
    
          it(`responds 400 'Password be less than 72 characters' when long password`, () => {
            const userLongPassword = {
                first_name: 'test first_name',
                last_name: 'test last_name',
                password: '*'.repeat(73),
                email: 'foo@gmail.com',
                phone_number: '7739514325',
            }
            return supertest(app)
              .post('/api/users')
              .send(userLongPassword)
              .expect(400, { error: `Password must be less than 72 characters` })
          })
    
          it(`responds 400 error when password starts with spaces`, () => {
            const userPasswordStartsSpaces = {
                first_name: 'test first_name',
                last_name: 'test last_name',
                password: ' Abdefghij1',
                email: 'foo@gmail.com',
                phone_number: '7739514325',
            }
            return supertest(app)
              .post('/api/users')
              .send(userPasswordStartsSpaces)
              .expect(400, { error: `Password must not start or end with empty spaces` })
          })
    
          it(`responds 400 error when password ends with spaces`, () => {
            const userPasswordEndsSpaces = {
                first_name: 'test first_name',
                last_name: 'test last_name',
                password: 'Abdefghij1 ',
                email: 'foo@gmail.com',
                phone_number: '7739514325',
            }
            return supertest(app)
              .post('/api/users')
              .send(userPasswordEndsSpaces)
              .expect(400, { error: `Password must not start or end with empty spaces` })
          })
    
          it(`responds 400 error when password isn't complex enough`, () => {
            const userPasswordNotComplex = {
                first_name: 'test first_name',
                last_name: 'test last_name',
                password: 'Abcdefghijk',
                email: 'foo@gmail.com',
                phone_number: '7739514325',
            }
            return supertest(app)
              .post('/api/users')
              .send(userPasswordNotComplex)
              .expect(400, { error: `Password must contain one upper case, lower case, and number` })
          })
    
          it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
            const duplicateUser = {
                first_name: 'test first_name',
                last_name: 'test last_name',
                password: 'Password1',
                email: 'test@gmail.com',
                phone_number: '7739514325',
            }
            return supertest(app)
              .post('/api/users')
              .send(duplicateUser)
              .expect(400, { error: `There is already an account associated with this email` })
          })
        })
    
        context(`Happy path`, () => {
          it(`responds 201, serialized user, storing bcryped password`, () => {
            const newUser = {
                first_name: 'test first_name',
                last_name: 'test last_name',
                password: 'Password1',
                email: 'foo@gmail.com',
                phone_number: '7739514325',
            }
            return supertest(app)
              .post('/api/users')
              .send(newUser)
              .expect(201)
              .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.first_name).to.eql(newUser.first_name)
                expect(res.body.last_name).to.eql(newUser.last_name)
                expect(res.body.email).to.eql(newUser.email)
                expect(res.body.phone_number).to.eql(newUser.phone_number)
                expect(res.body).to.not.have.property('password')
                expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
              })
              .expect(res =>
                db
                  .from('drip_drop_users')
                  .select('*')
                  .where({ id: res.body.id })
                  .first()
                  .then(row => {
                    expect(row.first_name).to.eql(newUser.first_name)
                    expect(row.last_name).to.eql(newUser.last_name)
                    expect(row.email).to.eql(newUser.email)
                    expect(row.phone_number).to.eql(newUser.phone_number)
    
                    return bcrypt.compare(newUser.password, row.password)
                  })
                  .then(compareMatch => {
                    expect(compareMatch).to.be.true
                  })
              )
          })
        })
      })

})