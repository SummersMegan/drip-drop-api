const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            first_name: 'test-user-1',
            last_name: 'Test user 1',
            password: 'password',
            email: 'test@gmail.com',
            phone_number: '12312345678'
        },
        {
            id: 2,
            first_name: 'test-user-2',
            last_name: 'Test user 2',
            password: 'password',
            email: 'test@gmail.com',
            phone_number: '12312345678'
        },
        {
            id: 3,
            first_name: 'test-user-3',
            last_name: 'Test user 3',
            password: 'password',
            email: 'test@gmail.com',
            phone_number: '12312345678'
        },
        {
            id: 4,
            first_name: 'test-user-4',
            last_name: 'Test user 4',
            password: 'password',
            email: 'test@gmail.com',
            phone_number: '12312345678'
        },
    ]
}

function makePlantsArray() {
  return [
      {
          id: 1,
          name: 'test-plant-1',
          water_every: 3,
          watering_directions: 'test',
          img: 'test',
      },
      {
        id: 2,
        name: 'test-plant-2',
        water_every: 3,
        watering_directions: 'test',
        img: 'test',
      },
      {
        id: 3,
        name: 'test-plant-3',
        water_every: 3,
        watering_directions: 'test',
        img: 'test',
      }
  ]
}

function makeRemindersArray() {
  return [
      {
          id:1,
          plant_id: 2,
          user_id: 1,
          remind_on: "2020-02-02T00:00:00.000Z"
      },
      {
        id:2,
        plant_id: 1,
        user_id: 1,
        remind_on: "2020-02-02T00:00:00.000Z"
      },
      {
        id:3,
        plant_id: 3,
        user_id: 1,
        remind_on: "2020-02-02T00:00:00.000Z"
      },
      {
        id:4,
        plant_id: 3,
        user_id: 2,
        remind_on: "2020-02-02T00:00:00.000Z"
      }
  ]
}

function makeExpectedSmsArray(){
  return [
    {
      reminder_id: 1,
      plant_name: 'test-plant-2',
      water_every: 3,
      phone_number: '12312345678',
      reminder_date: "2020-02-02"
    },
    {
      reminder_id: 2,
      plant_name: 'test-plant-1',
      water_every: 3,
      phone_number: '12312345678',
      reminder_date: "2020-02-02"
    },
    {
      reminder_id: 3,
      plant_name: 'test-plant-3',
      water_every: 3,
      phone_number: '12312345678',
      reminder_date: "2020-02-02"
    },
    {
      reminder_id: 4,
      plant_name: 'test-plant-3',
      water_every: 3,
      phone_number: '12312345678',
      reminder_date: "2020-02-02"
    }
  ]
}

function makeExpectedUser2RemindersArray(){
  return [
    {
      id: 3,
      name: 'test-plant-3',
      water_every: 3,
      watering_directions: 'test',
      img: 'test',
    }
  ]
}


function makePlantsFixtures(){
  const testPlants = makePlantsArray()
  const testUsers = makeUsersArray()
  const testReminders = makeRemindersArray()
  return {testPlants, testUsers, testReminders}
}

function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          drip_drop_reminders,
          drip_drop_users,
          drip_drop_plants
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE drip_drop_reminders_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE drip_drop_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE drip_drop_plants_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('drip_drop_reminders_id_seq', 0)`),
          trx.raw(`SELECT setval('drip_drop_users_id_seq', 0)`),
          trx.raw(`SELECT setval('drip_drop_plants_id_seq', 0)`),
        ])
      )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('drip_drop_users').insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('drip_drop_users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
}

function seedPlants(db, plants) {
  const preppedPlants = plants.map(plant => ({
    ...plant,
  }))
  return db.into('drip_drop_plants').insert(preppedPlants)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('drip_drop_users_id_seq', ?)`,
        [plants[plants.length - 1].id],
      )
    )
}

function seedReminders(db, reminders) {
  return db.into('drip_drop_reminders').insert(reminders)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('drip_drop_reminders_id_seq', ?)`,
        [reminders[reminders.length - 1].id],
      )
    )
}

function makeMaliciousUser() {
    const maliciousUser = {
      id: 911,
      first_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
      last_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
      password: 'password',
      email: 'test@gmail.com',
      phone_number: '12312345678'
    }
    const expectedUser = {
        id: 911,
        first_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        last_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        password: 'password',
        email: 'test@gmail.com',
        phone_number: '12312345678'
    }
    return {
      maliciousUser,
      expectedUser,
    }
}

function makeMaliciousPlant() {
  const maliciousPlant = {
    id: 911,
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    water_every: 2,
    watering_directions: 'Naughty naughty very naughty <script>alert("xss");</script>',
    img: 'Naughty naughty very naughty <script>alert("xss");</script>'
  }
  const expectedPlant = {
    id: 911,
    name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    water_every: 2,
    watering_directions: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    img: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
  }
  return {
    maliciousPlant,
    expectedPlant,
  }
}

function seedMaliciousUser(db,user){
    //return seedUsers(db,[user])
      //  .then(()=>
            return db  
                .into('drip_drop_users')
                .insert(user)
        //)
}

function seedMaliciousPlant(db,plant){
  //return seedUsers(db,[user])
    //  .then(()=>
          return db  
              .into('drip_drop_plants')
              .insert(plant)
      //)
}

/*function seedPlantsTables(db, users, plants, reminders) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedPlants(trx, plants)
    await trx.into('drip_drop_users').insert(users)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('drip_drop_users_id_seq', ?)`,
      [users[users.length - 1].id],
    )
    // only insert comments if there are some, also update the sequence counter
    if (reminders.length) {
      await trx.into('blogful_comments').insert(comments)
      await trx.raw(
        `SELECT setval('blogful_comments_id_seq', ?)`,
        [comments[comments.length - 1].id],
      )
    }
  })
}*/

module.exports = {
    makeUsersArray,
    makePlantsArray,
    makeRemindersArray,
    makePlantsFixtures,
    cleanTables,
    seedUsers,
    seedPlants,
    seedReminders,
    makeMaliciousUser,
    makeMaliciousPlant,
    seedMaliciousUser,
    seedMaliciousPlant,
    //seedPlantsTables,
    makeExpectedUser2RemindersArray,
    makeExpectedSmsArray
}