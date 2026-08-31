const { Categoria } = require('../models')

const cadastrar = async (req, res) => {
    try{
        const categoria = await Categoria.create(req.body)

        res.status(201).json({message: 'Categoria cadastrada com sucesso!', categoria})
    }
    catch(err){
        console.error('Erro ao cadastrar categoria', err)
        res.status(500).json({message: 'Falha ao cadastrar categoria.'})
    }
}

const listar = async (req, res) => {
    try{
        const categorias = await Categoria.findAll()

        res.status(200).json({categorias})
    }
    catch(err){
        console.error('Erro ao listar categorias', err)
        res.status(500).json({message: 'Falha ao listar categorias.'})
    }
}

const consultar = async (req, res) => {
    const id = req.params.id

    try{
        const categoria = await Categoria.findByPk(id)

        if(!categoria){
            return res.status(404).json({message: `A Categoria com id ${id} nao existe!`})
        }

        res.status(200).json({categoria})
    }
    catch(err){
        console.error('Erro ao consultar categoria', err)
        res.status(500).json({message: 'Falha ao consultar categoria.'})
    }
}

const apagar = async (req, res) => {
    const id = req.params.id

    try{
        const categoria = await Categoria.findByPk(id)

        if(!categoria){
            return res.status(404).json({message: `A Categoria com id ${id} nao existe!`})
        }

        await Categoria.destroy({where: {id}})

        res.status(200).json({message: `Categoria com id ${id} foi apagada com sucesso!`})
    }
    catch(err){
        console.error('Erro ao apagar categoria', err)
        res.status(500).json({message: 'Falha ao apagar categoria.'})
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id

    try{
        const categoria = await Categoria.findByPk(id)

        if(!categoria){
            return res.status(404).json({message: `A Categoria com id ${id} nao existe!`})
        }

        await Categoria.update(req.body, {where: {id}})

        res.status(200).json({message: `Categoria com id ${id} foi atualizada com sucesso!`})
    }
    catch(err){
        console.error('Erro ao atualizar categoria', err)
        res.status(500).json({message: 'Falha ao atualizar categoria.'})
    }
}

const atualizarParcial = async (req, res) => {
    await atualizar(req, res)
}

module.exports = { cadastrar, listar, consultar, apagar, atualizar, atualizarParcial }
