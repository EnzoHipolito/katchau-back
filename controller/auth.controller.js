const Usuario = require('../models/Usuario')
const jwt = require('../services/jwt.service')
const bcrypt = require('../services/bcrypt.service')

const login = async (req, res) => {
    const {email, senha} = req.body

    try{
        const usuario = await Usuario.findOne({where: {email}})

        if(!usuario){
            return res.status(404).json({message: 'Esse usuario nao existe!'})
        }

        const senhaCript = bcrypt.hashCompare(senha, usuario.senha_hash)

        if(!senhaCript){
            return res.status(401).json({message: 'Senha incorreta'})
        }

        const payload = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil
        }
        const token = jwt.generateToken(payload)

        return res.status(200).json({message: 'Login realizado com sucesso!', token})
    }
    catch(err){
        res.status(500).json({message: 'Falha ao realizar o seu login!'})
        console.error(err)
    }
}

const register = async (req, res) => {
    const valores = req.body

    if(!valores.nome || !valores.email || !valores.senha || !valores.cpf){
        return res.status(400).json({message: 'Preencha todos os campos obrigatorios: nome, email, senha e cpf.'})
    }

    if(valores.cargo || valores.perfil){
        return res.status(403).json({message: 'Voce nao pode enviar um perfil na requisicao!'})
    }

    const senhaCript = bcrypt.hashGenerator(valores.senha)

    const valores2 = {
        nome: valores.nome,
        email: valores.email,
        senha_hash: senhaCript,
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
