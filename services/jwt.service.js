const jwt = require('jsonwebtoken')

const CHAVE_SECRETA = process.env.JWT_SECRET
const EXPIRES_IN = process.env.JWT_EXPIRES_IN

function generateToken(payload){
    return jwt.sign(payload, SECRET_KEY, {expiresIn: EXPIRES_IN})
}

function verifyToken(token){
    return jwt.verify(token, CHAVE_SECRETA)
}

module.exports = { generateToken, verifyToken }