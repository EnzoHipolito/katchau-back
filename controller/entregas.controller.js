const { Entrega } = require('../models')

const cadastrar = async (req, res) => {
    try{
        const entrega = await Entrega.create(req.body)

        res.status(201).json({message: 'Entrega cadastrada com sucesso!', entrega})
    }
    catch(err){
        console.error('Erro ao cadastrar entrega', err)
        res.status(500).json({message: 'Falha ao cadastrar entrega.'})
    }
}

const listar = async (req, res) => {
    try{
        const entregas = await Entrega.findAll()

        res.status(200).json({entregas})
    }
    catch(err){
        console.error('Erro ao listar entregas', err)
        res.status(500).json({message: 'Falha ao listar entregas.'})
    }
}

const consultar = async (req, res) => {
    const id = req.params.id

    try{
        const entrega = await Entrega.findByPk(id)

        if(!entrega){
            return res.status(404).json({message: `A Entrega com id ${id} nao existe!`})
        }

        res.status(200).json({entrega})
    }
    catch(err){
        console.error('Erro ao consultar entrega', err)
        res.status(500).json({message: 'Falha ao consultar entrega.'})
    }
}

const apagar = async (req, res) => {
    const id = req.params.id

    try{
        const entrega = await Entrega.findByPk(id)

        if(!entrega){
            return res.status(404).json({message: `A Entrega com id ${id} nao existe!`})
        }

        await Entrega.destroy({where: {id}})

        res.status(200).json({message: `Entrega com id ${id} foi apagada com sucesso!`})
    }
    catch(err){
        console.error('Erro ao apagar entrega', err)
        res.status(500).json({message: 'Falha ao apagar entrega.'})
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id

    try{
        const entrega = await Entrega.findByPk(id)

        if(!entrega){
            return res.status(404).json({message: `A Entrega com id ${id} nao existe!`})
        }

        await Entrega.update(req.body, {where: {id}})

        res.status(200).json({message: `Entrega com id ${id} foi atualizada com sucesso!`})
    }
    catch(err){
        console.error('Erro ao atualizar entrega', err)
        res.status(500).json({message: 'Falha ao atualizar entrega.'})
    }
}

const atualizarParcial = async (req, res) => {
    await atualizar(req, res)
}

module.exports = { cadastrar, listar, consultar, apagar, atualizar, atualizarParcial }
