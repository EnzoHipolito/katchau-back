const { Produto, Categoria, Estoque } = require('../models')

const cadastrar = async (req, res) => {
    const valores = req.body

    try{
        await Produto.create(valores)

        res.status(201).json({message: 'Produto cadastrado com sucesso!'})
    }
    catch(err){
        console.error('Erro ao cadastrar produto', err)
        res.status(500).json({message: 'Falha ao cadastrar produto.'})
    }
}

const listar = async (req, res) => {
    try{
        const produtos = await Produto.findAll({
            where: {ativo: true},
            include: [
                {model: Categoria, as: 'categoria'},
                {model: Estoque, as: 'estoque'}
            ]
        })

        res.status(200).json({produtos})
    }
    catch(err){
        console.error('Erro ao listar produto', err)
        res.status(500).json({message: 'Falha ao listar produtos.'})
    }
}

const consultar = async (req, res) => {
    const id = req.params.id

    try{
        const produto = await Produto.findByPk(id, {
            include: [
                {model: Categoria, as: 'categoria'},
                {model: Estoque, as: 'estoque'}
            ]
        })

        if(!produto){
            return res.status(404).json({message: `O Produto com id ${id} nao existe!`})
        }

        res.status(200).json({produto})
    }
    catch(err){
        console.error('Erro ao consultar produto', err)
        res.status(500).json({message: 'Falha ao consultar produto.'})
    }
}

const apagar = async (req, res) => {
    const id = req.params.id

    try{
        const produto = await Produto.findByPk(id)

        if(!produto){
            return res.status(404).json({message: `O Produto com id ${id} nao existe!`})
        }

        await Produto.update({ativo: false}, {where: {id}})

        res.status(200).json({message: `Produto com o id ${id} foi desativado com sucesso!`})
    }
    catch(err){
        console.error('Erro ao apagar produto', err)
        res.status(500).json({message: 'Falha ao apagar produto.'})
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try{
        const produto = await Produto.findByPk(id)

        if(!produto){
            return res.status(404).json({message: `O Produto com id ${id} nao existe!`})
        }

        await Produto.update(valores, {where: {id}})

        res.status(200).json({message: `Produto com id ${id} foi atualizado com sucesso!`})
    }
    catch(err){
        console.error('Erro ao atualizar produto', err)
        res.status(500).json({message: 'Falha ao atualizar produto.'})
    }
}

const atualizarParcial = async (req, res) => {
    await atualizar(req, res)
}

module.exports = { cadastrar, apagar, atualizar, atualizarParcial, consultar, listar }
