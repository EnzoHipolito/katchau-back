const jwtService = require('../services/jwt.service')
const Usuario = require('../models/Usuario')

const onlyAdmin = (req, res, next) => {
    const idUsuario = req.user.codUsuario
    
    try {
        const usuario = Usuario.findOne({where: {codUsuario: idUsuario}})
        
        if(usuario.cargo !== 'ADMIN'){
            return res.status(403).json({message: "Você não tem permissão para fazer essa ação!"})
        }

        next()
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido ou expirado!' })
    }
}

module.exports = {onlyAdmin}