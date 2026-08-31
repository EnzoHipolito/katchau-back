const jwtService = require('../services/jwt.service')

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization

    if(!token){
        return res.status(401).json({message: 'Acesso negado. Voce precisa estar logado para realizar esta acao!'})
    }

    try {
        const decoded = jwtService.verifyToken(token)

        req.user = decoded

        next()
    } catch (err) {
        return res.status(401).json({message: 'Token invalido ou expirado!'})
    }
}

module.exports = authMiddleware
