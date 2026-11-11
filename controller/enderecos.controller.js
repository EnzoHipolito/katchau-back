const { Endereco } = require('../models')

const cadastrar = async (req, res) => {
    if(!req.body.cep || !req.body.rua || !req.body.numero || !req.body.complemento || !req.body.bairro || !req.body.cidade || !req.body.uf){
        return res.status(400).json({message: 'Preencha todos os campos obrigatorios do endereco.'})
    }

    try{
        const endereco = await Endereco.create({
            idUsuario: req.user.id,
            cep: req.body.cep,
            rua: req.body.rua,
            numero: req.body.numero,
            complemento: req.body.complemento,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            uf: req.body.uf
        })

        res.status(201).json({message: 'Endereco cadastrado com sucesso!', endereco})
    }
    catch(err){
        console.error('Erro ao cadastrar endereco', err)
        res.status(500).json({message: 'Falha ao cadastrar endereco.'})
    }
}

const listar = async (req, res) => {
    try{
        const enderecos = await Endereco.findAll({where: {idUsuario: req.user.id}})

        res.status(200).json({enderecos})
    }
    catch(err){
        console.error('Erro ao listar enderecos', err)
        res.status(500).json({message: 'Falha ao listar enderecos.'})
    }
}

const consultar = async (req, res) => {
    try{
        const endereco = await Endereco.findOne({
            where: {
                id: req.params.id,
                idUsuario: req.user.id
            }
        })

        if(!endereco){
            return res.status(404).json({message: 'Endereco nao encontrado.'})
        }

        res.status(200).json({endereco})
    }
    catch(err){
        console.error('Erro ao consultar endereco', err)
        res.status(500).json({message: 'Falha ao consultar endereco.'})
    }
}

const atualizar = async (req, res) => {
    try{
        const endereco = await Endereco.findOne({
            where: {
                id: req.params.id,
                idUsuario: req.user.id
            }
        })

        if(!endereco){
            return res.status(404).json({message: 'Endereco nao encontrado.'})
        }

        endereco.cep = req.body.cep || endereco.cep
        endereco.rua = req.body.rua || endereco.rua
        endereco.numero = req.body.numero || endereco.numero
        endereco.complemento = req.body.complemento || endereco.complemento
        endereco.bairro = req.body.bairro || endereco.bairro
        endereco.cidade = req.body.cidade || endereco.cidade
        endereco.uf = req.body.uf || endereco.uf

        await endereco.save()

        res.status(200).json({message: 'Endereco atualizado com sucesso!', endereco})
    }
    catch(err){
        console.error('Erro ao atualizar endereco', err)
        res.status(500).json({message: 'Falha ao atualizar endereco.'})
    }
}

const apagar = async (req, res) => {
    try{
        const endereco = await Endereco.findOne({
            where: {
                id: req.params.id,
                idUsuario: req.user.id
            }
        })

        if(!endereco){
            return res.status(404).json({message: 'Endereco nao encontrado.'})
        }

        await endereco.destroy()

        res.status(200).json({message: 'Endereco apagado com sucesso!'})
    }
    catch(err){
        console.error('Erro ao apagar endereco', err)
        res.status(500).json({message: 'Falha ao apagar endereco.'})
    }
}

const atualizarParcial = async (req, res) => {
    await atualizar(req, res)
}

module.exports = { cadastrar, listar, consultar, atualizar, atualizarParcial, apagar }

