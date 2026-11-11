const { Pedido } = require('../models')
const checkoutService = require('../services/checkout.service')

const responderErroCheckout = (res, err) => {
    if(err instanceof checkoutService.CheckoutError){
        return res.status(err.status).json({message: err.message})
    }

    console.error('Erro no checkout', err)
    return res.status(500).json({message: 'Falha ao processar o pedido.'})
}

const cadastrar = async (req, res) => {
    try{
        const pedido = await checkoutService.criarCheckout({
            usuarioId: req.user.id || req.user.sub,
            itens: req.body.itens,
            desconto: req.body.desconto
        })

        res.status(201).json({message: 'Checkout criado com sucesso!', pedido})
    }
    catch(err){
        responderErroCheckout(res, err)
    }
}

const confirmar = async (req, res) => {
    try{
        const pedido = await checkoutService.confirmarPedido(req.params.id)

        res.status(200).json({message: 'Pedido confirmado e estoque atualizado com sucesso!', pedido})
    }
    catch(err){
        responderErroCheckout(res, err)
    }
}

const concluir = async (req, res) => {
    try{
        const pedido = await checkoutService.concluirPedido(req.params.id)

        res.status(200).json({message: 'Pedido concluido com sucesso!', pedido})
    }
    catch(err){
        responderErroCheckout(res, err)
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
    const userId = req.user.id

    try{
        
        const pedido = await Pedido.findByPk(id)

        
        if(!pedido){
            return res.status(404).json({message: `O Pedido com id ${id} nao existe!`})
        }
        
        if(userId !== pedido.usuario_id){
            return res.status(403).json({message: "Você não pode consultar pedidos dessa conta!"})
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

    if(req.body.status !== undefined){
        return res.status(400).json({message: 'Use as rotas /confirmar ou /concluir para alterar o status do pedido.'})
    }

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

module.exports = { cadastrar, confirmar, concluir, listar, consultar, apagar, atualizar, atualizarParcial }
