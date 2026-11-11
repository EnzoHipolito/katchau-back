const { randomUUID } = require('crypto')
const { Op } = require('sequelize')
const db = require('../config/db')
const { Pedido, ItemPedido, Produto, Estoque } = require('../models')

class CheckoutError extends Error {
    constructor(message, status = 400){
        super(message)
        this.status = status
    }
}

const arredondarDinheiro = (valor) => Number(Number(valor).toFixed(2))

const normalizarItens = (itens) => {
    if(!Array.isArray(itens) || itens.length === 0){
        throw new CheckoutError('Informe ao menos um produto no campo itens.')
    }

    const itensAgrupados = new Map()

    for(const item of itens){
        const produtoId = Number(item.produto_id)
        const quantidade = Number(item.quantidade)

        if(!Number.isInteger(produtoId) || produtoId <= 0){
            throw new CheckoutError('Todos os itens precisam de um produto_id valido.')
        }

        if(!Number.isInteger(quantidade) || quantidade <= 0){
            throw new CheckoutError('A quantidade de cada item deve ser um inteiro maior que zero.')
        }

        itensAgrupados.set(produtoId, (itensAgrupados.get(produtoId) || 0) + quantidade)
    }

    return [...itensAgrupados]
        .map(([produto_id, quantidade]) => ({produto_id, quantidade}))
        .sort((itemA, itemB) => itemA.produto_id - itemB.produto_id)
}

const criarCheckout = async ({usuarioId, itens, desconto = 0}) => {
    if(!usuarioId){
        throw new CheckoutError('Usuario nao autenticado.', 401)
    }

    const itensNormalizados = normalizarItens(itens)
    const descontoNumerico = Number(desconto)

    if(!Number.isFinite(descontoNumerico) || descontoNumerico < 0){
        throw new CheckoutError('O desconto deve ser um valor maior ou igual a zero.')
    }

    return db.transaction(async (transaction) => {
        const idsProdutos = itensNormalizados.map(item => item.produto_id)
        const produtos = await Produto.findAll({
            where: {
                id: {[Op.in]: idsProdutos},
                ativo: true
            },
            transaction
        })

        if(produtos.length !== idsProdutos.length){
            throw new CheckoutError('Um ou mais produtos nao existem ou estao inativos.', 404)
        }

        const produtosPorId = new Map(produtos.map(produto => [produto.id, produto]))
        const estoques = await Estoque.findAll({
            where: {produto_id: {[Op.in]: idsProdutos}},
            transaction
        })
        const estoquesPorProduto = new Map(estoques.map(estoque => [estoque.produto_id, estoque]))

        for(const item of itensNormalizados){
            const estoque = estoquesPorProduto.get(item.produto_id)

            if(!estoque){
                throw new CheckoutError(`Nao existe estoque cadastrado para o produto ${item.produto_id}.`, 409)
            }

            if(estoque.quantidade < item.quantidade){
                throw new CheckoutError(
                    `Estoque insuficiente para o produto ${item.produto_id}. Disponivel: ${estoque.quantidade}.`,
                    409
                )
            }
        }

        const itensDoPedido = itensNormalizados.map(item => {
            const produto = produtosPorId.get(item.produto_id)
            const precoUnitario = arredondarDinheiro(produto.preco)

            return {
                ...item,
                preco_unitario: precoUnitario,
                subtotal: arredondarDinheiro(precoUnitario * item.quantidade)
            }
        })

        const subtotal = arredondarDinheiro(
            itensDoPedido.reduce((total, item) => total + item.subtotal, 0)
        )

        if(descontoNumerico > subtotal){
            throw new CheckoutError('O desconto nao pode ser maior que o subtotal do pedido.')
        }

        const pedido = await Pedido.create({
            codigo: `PED-${randomUUID()}`,
            usuario_id: usuarioId,
            status: 'PENDENTE',
            subtotal,
            desconto: arredondarDinheiro(descontoNumerico),
            total: arredondarDinheiro(subtotal - descontoNumerico)
        }, {transaction})

        await ItemPedido.bulkCreate(
            itensDoPedido.map(item => ({...item, pedido_id: pedido.id})),
            {transaction}
        )

        return Pedido.findByPk(pedido.id, {
            include: [{model: ItemPedido, as: 'itens'}],
            transaction
        })
    })
}

const confirmarPedido = async (pedidoId) => {
    return db.transaction(async (transaction) => {
        const pedido = await Pedido.findByPk(pedidoId, {
            include: [{model: ItemPedido, as: 'itens'}],
            transaction,
            lock: transaction.LOCK.UPDATE
        })

        if(!pedido){
            throw new CheckoutError('Pedido nao encontrado.', 404)
        }

        if(pedido.status === 'CONFIRMADO'){
            throw new CheckoutError('Este pedido ja foi confirmado e o estoque ja foi descontado.', 409)
        }

        if(pedido.status !== 'PENDENTE'){
            throw new CheckoutError(`Um pedido ${pedido.status} nao pode ser confirmado.`, 409)
        }

        if(!pedido.itens || pedido.itens.length === 0){
            throw new CheckoutError('O pedido nao possui itens.', 409)
        }

        const itensOrdenados = [...pedido.itens].sort((itemA, itemB) => itemA.produto_id - itemB.produto_id)

        for(const item of itensOrdenados){
            const estoque = await Estoque.findOne({
                where: {produto_id: item.produto_id},
                transaction,
                lock: transaction.LOCK.UPDATE
            })

            if(!estoque){
                throw new CheckoutError(`Nao existe estoque cadastrado para o produto ${item.produto_id}.`, 409)
            }

            if(estoque.quantidade < item.quantidade){
                throw new CheckoutError(
                    `Estoque insuficiente para o produto ${item.produto_id}. Disponivel: ${estoque.quantidade}.`,
                    409
                )
            }

            estoque.quantidade -= item.quantidade
            estoque.ultima_movimentacao = new Date()
            await estoque.save({transaction})
        }

        pedido.status = 'CONFIRMADO'
        await pedido.save({transaction})

        return pedido
    })
}

const concluirPedido = async (pedidoId) => {
    return db.transaction(async (transaction) => {
        const pedido = await Pedido.findByPk(pedidoId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        })

        if(!pedido){
            throw new CheckoutError('Pedido nao encontrado.', 404)
        }

        if(pedido.status !== 'CONFIRMADO'){
            throw new CheckoutError('Somente pedidos confirmados podem ser concluidos.', 409)
        }

        pedido.status = 'CONCLUIDO'
        await pedido.save({transaction})

        return pedido
    })
}

module.exports = { CheckoutError, criarCheckout, confirmarPedido, concluirPedido }
