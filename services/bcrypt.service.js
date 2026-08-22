const bcrypt = require('bcrypt')

const SALT_ROUNDS = process.env.SALT_ROUNDS

function hashGenerator(pass){
    return bcrypt.hashSync(pass, Number(SALT_ROUNDS))
}

function hashCompare(pass, passCript){
    return bcrypt.compareSync(pass, passCript)
}

module.exports = { hashGenerator, hashCompare }