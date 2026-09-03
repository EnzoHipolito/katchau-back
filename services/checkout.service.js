const { randomBytes } = require('crypto')
const db = require('../config/db')
const { Usuario, Produto, Estoque, Pedido, ItemPedido, Entrega } = require('../models')

class CheckoutError extends Error {
    constructor(message, status = 400){
        super(message)
        this.name = 'CheckoutError'
        this.status = status
    }
}

const normalizarItens = (itens) => {
    if(!Array.isArray(itens) || itens.length === 0){
        throw new CheckoutError('Informe ao menos um item para concluir o pedido.')
    }

    const quantidadesPorProduto = new Map()

    for(const item of itens){
        const produtoId = Number(item?.produto_id)
        const quantidade = Number(item?.quantidade)

        if(!Number.isInteger(produtoId) || produtoId <= 0){
            throw new CheckoutError('Todos os itens precisam de um produto_id valido.')
        }

        if(!Number.isInteger(quantidade) || quantidade <= 0){
            throw new CheckoutError(`A quantidade do produto ${produtoId} deve ser um inteiro maior que zero.`)
        }

        quantidadesPorProduto.set(
            produtoId,
            (quantidadesPorProduto.get(produtoId) || 0) + quantidade
        )
    }

    return [...quantidadesPorProduto.entries()]
        .map(([produto_id, quantidade]) => ({produto_id, quantidade}))
        .sort((itemA, itemB) => itemA.produto_id - itemB.produto_id)
}

const montarEndereco = (usuario) => {
    const camposObrigatorios = ['cep', 'rua', 'numero', 'bairro', 'cidade', 'uf']
    const enderecoIncompleto = camposObrigatorios.some(campo => {
        const valor = usuario[campo]
        return valor === null || valor === undefined || String(valor).trim() === ''
    })

    if(enderecoIncompleto){
        throw new CheckoutError('Complete o endereco do usuario antes de concluir o pedido.')
    }

    const complemento = usuario.complemento ? `, ${usuario.complemento}` : ''
    return `${usuario.rua}, ${usuario.numero}${complemento} - ${usuario.bairro}, ${usuario.cidade}/${usuario.uf} - CEP ${usuario.cep}`
}

const gerarCodigoPedido = () => `PED-${Date.now()}-${randomBytes(4).toString('hex')}`

const concluirPedido = async ({usuarioId, itens}) => {
    const itensNormalizados = normalizarItens(itens)

    return db.transaction(async (transaction) => {
        const usuario = await Usuario.findByPk(usuarioId, {transaction})
        if(!usuario){
            throw new CheckoutError('Usuario nao encontrado.', 404)
        }

        const enderecoCompleto = montarEndereco(usuario)
        const produtoIds = itensNormalizados.map(item => item.produto_id)

        const estoques = await Estoque.findAll({
            where: {produto_id: produtoIds},
            order: [['produto_id', 'ASC']],
            transaction,
            lock: transaction.LOCK.UPDATE
        })

        const estoquePorProduto = new Map(
            estoques.map(estoque => [estoque.produto_id, estoque])
        )

        const produtos = await Produto.findAll({
            where: {id: produtoIds},
            transaction
        })
        const produtoPorId = new Map(produtos.map(produto => [produto.id, produto]))

        let subtotalCentavos = 0
        const itensDoPedido = itensNormalizados.map(item => {
            const produto = produtoPorId.get(item.produto_id)
            const estoque = estoquePorProduto.get(item.produto_id)

            if(!produto){
                throw new CheckoutError(`Produto ${item.produto_id} nao encontrado.`, 404)
            }

            if(!produto.ativo){
                throw new CheckoutError(`O produto ${produto.nome} nao esta ativo.`, 409)
            }

            if(!estoque){
                throw new CheckoutError(`O produto ${produto.nome} nao possui estoque cadastrado.`, 409)
            }

            if(estoque.quantidade < item.quantidade){
                throw new CheckoutError(
                    `Estoque insuficiente para ${produto.nome}. Disponivel: ${estoque.quantidade}.`,
                    409
                )
            }

            const precoCentavos = Math.round(Number(produto.preco) * 100)
            if(!Number.isSafeInteger(precoCentavos) || precoCentavos < 0){
                throw new CheckoutError(`O produto ${produto.nome} possui um preco invalido.`, 409)
            }

            const itemSubtotalCentavos = precoCentavos * item.quantidade
            subtotalCentavos += itemSubtotalCentavos

            return {
                produto_id: produto.id,
                quantidade: item.quantidade,
                preco_unitario: (precoCentavos / 100).toFixed(2),
                subtotal: (itemSubtotalCentavos / 100).toFixed(2),
                estoque
            }
        })

        const subtotal = (subtotalCentavos / 100).toFixed(2)
        const pedido = await Pedido.create({
            codigo: gerarCodigoPedido(),
            usuario_id: usuario.id,
            status: 'CONFIRMADO',
            subtotal,
            desconto: '0.00',
            total: subtotal,
            data_pedido: new Date()
        }, {transaction})

        await ItemPedido.bulkCreate(
            itensDoPedido.map(item => ({
                pedido_id: pedido.id,
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario,
                subtotal: item.subtotal
            })),
            {transaction}
        )

        const movimentadoEm = new Date()
        for(const item of itensDoPedido){
            item.estoque.quantidade -= item.quantidade
            item.estoque.ultima_movimentacao = movimentadoEm
            await item.estoque.save({transaction})
        }

        await Entrega.create({
            pedido_id: pedido.id,
            status: 'PREPARANDO',
            endereco_completo: enderecoCompleto
        }, {transaction})

        return pedido.id
    })
}

module.exports = { CheckoutError, concluirPedido, normalizarItens }
