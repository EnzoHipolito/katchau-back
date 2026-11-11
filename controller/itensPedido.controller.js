const { ItemPedido } = require('../models')

const cadastrar = async (req, res) => {
    if(!req.body.pedido_id || !req.body.produto_id || !req.body.quantidade || req.body.preco_unitario === undefined || req.body.subtotal === undefined){
        return res.status(400).json({message: 'Preencha todos os campos obrigatorios do item do pedido.'})
    }

    try{
        const itemPedido = await ItemPedido.create(req.body)

        res.status(201).json({message: 'Item do pedido cadastrado com sucesso!', itemPedido})
    }
    catch(err){
        console.error('Erro ao cadastrar item do pedido', err)
        res.status(500).json({message: 'Falha ao cadastrar item do pedido.'})
    }
}

const listar = async (req, res) => {
    try{
        const itensPedido = await ItemPedido.findAll()

        res.status(200).json({itensPedido})
    }
    catch(err){
        console.error('Erro ao listar itens do pedido', err)
        res.status(500).json({message: 'Falha ao listar itens do pedido.'})
    }
}

const consultar = async (req, res) => {
    const id = req.params.id

    try{
        const itemPedido = await ItemPedido.findByPk(id)

        if(!itemPedido){
            return res.status(404).json({message: `O ItemPedido com id ${id} nao existe!`})
        }

        res.status(200).json({itemPedido})
    }
    catch(err){
        console.error('Erro ao consultar item do pedido', err)
        res.status(500).json({message: 'Falha ao consultar item do pedido.'})
    }
}

const apagar = async (req, res) => {
    const id = req.params.id

    try{
        const itemPedido = await ItemPedido.findByPk(id)

        if(!itemPedido){
            return res.status(404).json({message: `O ItemPedido com id ${id} nao existe!`})
        }

        await ItemPedido.destroy({where: {id}})

        res.status(200).json({message: `ItemPedido com id ${id} foi apagado com sucesso!`})
    }
    catch(err){
        console.error('Erro ao apagar item do pedido', err)
        res.status(500).json({message: 'Falha ao apagar item do pedido.'})
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id

    try{
        const itemPedido = await ItemPedido.findByPk(id)

        if(!itemPedido){
            return res.status(404).json({message: `O ItemPedido com id ${id} nao existe!`})
        }

        await ItemPedido.update(req.body, {where: {id}})

        res.status(200).json({message: `ItemPedido com id ${id} foi atualizado com sucesso!`})
    }
    catch(err){
        console.error('Erro ao atualizar item do pedido', err)
        res.status(500).json({message: 'Falha ao atualizar item do pedido.'})
    }
}

const atualizarParcial = async (req, res) => {
    await atualizar(req, res)
}

module.exports = { cadastrar, listar, consultar, apagar, atualizar, atualizarParcial }
