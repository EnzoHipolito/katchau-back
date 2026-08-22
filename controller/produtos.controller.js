const Produtos = require('../models/Produto')

const cadastrar = async (req, res) => {
    const valores = req.body

    try{
        await Produtos.create(valores)

        res.status(201).json({message: 'Produto cadastrado com sucesso!'})
    }
    catch(err){
        console.error('Erro ao cadastrar produto', err)
    }
}

const listar = async (req, res) => {
    try{
        const produtos = await Produtos.findAll({raw: true})

        if(!produtos){
            return res.status(404).json({message: `Nenhum produto cadastrado.`})
        }

        res.status(200).json({produtos})
    }
    catch(err){
        console.error('Erro ao listar produto', err)
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    
    try{
        const produto = await Produtos.findOne({where: {codProduto: id}})

        if(!produto){
            return res.status(404).json({message: `O Produto com id ${id} não existe!`})
        }
        
        res.status(200).json({produto})
    }
    catch(err){
        console.error('Erro ao consultar produto', err)
    }
}

const apagar = async (req, res) => {
    const id = req.params.id
    
    try{
        const produto = Produtos.findOne({where: {codProduto: id}})

        if(!produto){
            return res.status(404).json({message: `O Produto com id ${id} não existe!`})
        }

        await Produtos.destroy({where: {codProduto: id}})

        res.status(200).json({message: `Produto com o id ${id} foi deletado com sucesso!`})
    }
    catch(err){
        console.error('Erro ao consultar produto', err)
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body
    
    try{
        const produto = Produtos.findOne({where: {codProduto: id}})

        if(!produto){
            return res.status(404).json({message: `O Produto com id ${id} não existe!`})
        }

        await Produtos.update(valores, {where: {codProduto: id}})

        res.status(200).json({message: `Produto com id ${id} foi atualizado com sucesso!`})
    }
    catch(err){
        console.error('Erro ao consultar produto', err)
    }
}

module.exports = { cadastrar, apagar, atualizar, consultar, listar }