const { Pedido } = require('../models')

const cadastrar = async (req, res) => {
    try{
        const pedido = await Pedido.create(req.body)

        res.status(201).json({message: 'Pedido cadastrado com sucesso!', pedido})
    }
    catch(err){
        console.error('Erro ao cadastrar pedido', err)
        res.status(500).json({message: 'Falha ao cadastrar pedido.'})
    }
}

const listar = async (req, res) => {
    try{
        const pedidos = await Pedido.findAll()

        res.status(200).json({pedidos})
    }
    catch(err){
        console.error('Erro ao listar pedidos', err)
        res.status(500).json({message: 'Falha ao listar pedidos.'})
    }
}

const consultar = async (req, res) => {
    const id = req.params.id

    try{
        const pedido = await Pedido.findByPk(id)

        if(!pedido){
            return res.status(404).json({message: `O Pedido com id ${id} nao existe!`})
        }

        res.status(200).json({pedido})
    }
    catch(err){
        console.error('Erro ao consultar pedido', err)
        res.status(500).json({message: 'Falha ao consultar pedido.'})
    }
}

const apagar = async (req, res) => {
    const id = req.params.id

    try{
        const pedido = await Pedido.findByPk(id)

        if(!pedido){
            return res.status(404).json({message: `O Pedido com id ${id} nao existe!`})
        }

        await Pedido.destroy({where: {id}})

        res.status(200).json({message: `Pedido com id ${id} foi apagado com sucesso!`})
    }
    catch(err){
        console.error('Erro ao apagar pedido', err)
        res.status(500).json({message: 'Falha ao apagar pedido.'})
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id

    try{
        const pedido = await Pedido.findByPk(id)

        if(!pedido){
            return res.status(404).json({message: `O Pedido com id ${id} nao existe!`})
        }

        await Pedido.update(req.body, {where: {id}})

        res.status(200).json({message: `Pedido com id ${id} foi atualizado com sucesso!`})
    }
    catch(err){
        console.error('Erro ao atualizar pedido', err)
        res.status(500).json({message: 'Falha ao atualizar pedido.'})
    }
}

const atualizarParcial = async (req, res) => {
    await atualizar(req, res)
}

module.exports = { cadastrar, listar, consultar, apagar, atualizar, atualizarParcial }
