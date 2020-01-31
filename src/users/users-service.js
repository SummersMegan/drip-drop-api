const xss = require('xss')

const UsersService = {
    getAllUsers(db){
        return db   
            .from('drip_drop_users')
            .select('*')
    },
    getById(db,userId){
        return db
            .from('drip_drop_users AS users')
            .select('*')
            .where('users.id', userId)
    },
    createNewUser(db, newUser){
        return db
            .insert(newUser)
            .into('drip_drop_users')
            .returning('*')
            .then(([user])=>user)
    },
    deleteUser(db, userId){
        return db   
            .from('drip_drop_users')
            .where('drip_drop_users.id',userId)
            .delete()
    },
    updateUser(db,userId,newUserFields){
        return db('drip_drop_user')
        .where({id})
        .update(newUserFields)
    },
    serializeUser(user){
        return {
            first_name: xss(user.first_name),
            last_name: xss(user.last_name),
            password: xss(user.password),
            email: xss(user.email),
            phone_number: user.phone_number
        }
    }
}

module.exports = UsersService