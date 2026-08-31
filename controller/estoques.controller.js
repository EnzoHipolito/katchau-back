const { Estoque } = require('../models')

const cadastrar = async (req, res) => {
    try{
        const estoque = await Estoque.create(req.body)

        res.status(201).json({message: 'Estoque cadastrado com sucesso!', estoque})
    }
    catch(err){
        console.error('Erro ao cadastrar estoque', err)
        res.status(500).json({message: 'Falha ao cadastrar estoque.'})
    }
}

const listar = async (req, res) => {
    try{
        const estoques = await Estoque.findAll()

        res.status(200).json({estoques})
    }
    catch(err){
        console.error('Erro ao listar estoques', err)
        res.status(500).json({message: 'Falha ao listar estoques.'})
    }
}

const consultar = async (req, res) => {
    const id = req.params.id

    try{
        const estoque = await Estoque.findByPk(id)

        if(!estoque){
            return res.status(404).json({message: `O Estoque com id ${id} nao existe!`})
        }

        res.status(200).json({estoque})
    }
    catch(err){
        console.error('Erro ao consultar estoque', err)
        res.status(500).json({message: 'Falha ao consultar estoque.'})
    }
}

const apagar = async (req, res) => {
    const id = req.params.id

    try{
        const estoque = await Estoque.findByPk(id)

        if(!estoque){
            return res.status(404).json({message: `O Estoque com id ${id} nao existe!`})
        }

        await Estoque.destroy({where: {id}})

        res.status(200).json({message: `Estoque com id ${id} foi apagado com sucesso!`})
    }
    catch(err){
        console.error('Erro ao apagar estoque', err)
        res.status(500).json({message: 'Falha ao apagar estoque.'})
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id

    try{
        const estoque = await Estoque.findByPk(id)

        if(!estoque){
            return res.status(404).json({message: `O Estoque com id ${id} nao existe!`})
        }

        await Estoque.update(req.body, {where: {id}})

        res.status(200).json({message: `Estoque com id ${id} foi atualizado com sucesso!`})
    }
    catch(err){
        console.error('Erro ao atualizar estoque', err)
        res.status(500).json({message: 'Falha ao atualizar estoque.'})
    }
}

const atualizarParcial = async (req, res) => {
    await atualizar(req, res)
}

module.exports = { cadastrar, listar, consultar, apagar, atualizar, atualizarParcial }
