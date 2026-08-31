const Usuario = require('../models/Usuario')

const onlyAdmin = async (req, res, next) => {
    const idUsuario = req.user?.sub || req.user?.id

    if(!idUsuario){
        return res.status(401).json({message: 'Usuario não autenticado!'})
    }

    try {
        const usuario = await Usuario.findByPk(idUsuario)

        if(!usuario || usuario.perfil !== 'ADMIN'){
            return res.status(403).json({message: 'Voce nao tem permissao para fazer essa acao!'})
        }

        next()
    } catch (err) {
        return res.status(500).json({message: 'Falha ao validar permissao de administrador!'})
    }
}

module.exports = { onlyAdmin }