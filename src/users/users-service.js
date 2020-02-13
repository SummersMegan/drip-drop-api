const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
    getAllUsers(db){
        return db   
            .from('drip_drop_users')
            .select('*')
    },
    insertUser(db, newUser){
        return db
            .insert(newUser)
            .into('drip_drop_users')
            .returning('*')
            .then(([user])=>user)
    },
    validatePassword(password){
        const REGEX_UPPER_LOWER_NUMBER = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/

        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER.test(password)) {
            return 'Password must contain one upper case, lower case, and number'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    hasUserWithEmail(db, email) {
        return db('drip_drop_users')
          .where({ email })
          .first()
          .then(user => !!user)
    },
    serializeUser(user){
        return {
            id: user.id,
            first_name: xss(user.first_name),
            last_name: xss(user.last_name),
            email: xss(user.email),
            phone_number: user.phone_number
        }
    }
}

module.exports = UsersService