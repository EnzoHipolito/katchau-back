const Usuario = require('../models/Usuario')
const jwt = require('../services/jwt.service')
const bcrypt = require('../services/bcrypt.service')

const login = async (req, res) => {
    const {email, senha} = req.body 

    try{
        const usuario = await Usuario.findOne({where: {email: email}})

        if(!usuario){
            return res.status(404).json({message: 'Esse usuario não existe!'})
        }else{
            const payload = {
                id: usuario.id,
                username: usuario.username,
                email: usuario.email,
                role: usuario.role
            }
            const senhaCript = bcrypt.hashCompare(senha, usuario.senha)

            if(!senhaCript){
                return res.status(401).json({message: 'Senha incorreta'})
            }else{
                const token = jwt.generateToken(payload)

                return res.status(200).json({message: 'Login realizado com sucesso!', token})
            }
        }
    }
    catch(err){
        res.status(500).json({message: 'Falha ao realizar o seu login!'})
        console.error(err)
    }
}

const register = async (req, res) => {
    const valores = req.body

    if(valores.cargo){
        return res.status(403).json({message: 'Você não pode enviar um cargo na requisição!'})
    }

    const senhaCript = hashGenerator(valores.senha)

    const valores2 = {
        nome: valores.nome,
        email: valores.email,
        senha: senhaCript,
        cpf: valores.cpf
    }

    try{
        await Usuario.create(valores2)

        res.status(201).json({message: 'Usuario registrado com sucesso!'})
    }catch(err){
        res.status(500).json({message: 'Falha ao registrar usuario.'})
        console.error('Erro ao registrar usuario', err)
    }
}

module.exports = { login, register }