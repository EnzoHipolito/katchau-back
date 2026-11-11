const db = require('../config/db')
const { Produto, ProdutoImagem, Categoria, Estoque } = require('../models')

const includeProduto = [
    {model: Categoria, as: 'categoria'},
    {model: Estoque, as: 'estoque'},
    {
        model: ProdutoImagem,
        as: 'imagens',
        separate: true,
        order: [['ordem', 'ASC'], ['id', 'ASC']]
    }
]

const normalizarImagens = (imagens) => {
    if(!Array.isArray(imagens) || imagens.length === 0){
        throw new Error('Informe ao menos uma imagem no campo imagens.')
    }

    const urls = new Set()

    return imagens.map((imagem, indice) => {
        const url = typeof imagem === 'string' ? imagem.trim() : imagem?.url?.trim()
        const ordemInformada = typeof imagem === 'object' ? imagem?.ordem : undefined
        const ordem = ordemInformada === undefined ? indice : Number(ordemInformada)

        if(!url){
            throw new Error(`A imagem da posicao ${indice} precisa ter uma URL.`)
        }

        try{
            const urlImagem = new URL(url)
            if(!['http:', 'https:'].includes(urlImagem.protocol)){
                throw new Error()
            }
        }
        catch{
            throw new Error(`A URL da imagem na posicao ${indice} e invalida.`)
        }

        if(!Number.isInteger(ordem) || ordem < 0){
            throw new Error(`A ordem da imagem na posicao ${indice} deve ser um inteiro nao negativo.`)
        }

        if(urls.has(url)){
            throw new Error(`A URL da imagem na posicao ${indice} esta duplicada.`)
        }

        urls.add(url)
        return {url, ordem}
    })
}

const cadastrar = async (req, res) => {
    const { imagens, imagem_url, ...valores } = req.body

    if(!valores.codigo || !valores.nome || !valores.descricao || valores.preco === undefined || !valores.categoria_id){
        return res.status(400).json({message: 'Preencha todos os campos obrigatorios do produto.'})
    }

    if(imagem_url !== undefined){
        return res.status(400).json({message: 'Use o campo imagens como array; imagem_url nao pertence mais ao produto.'})
    }

    let imagensNormalizadas
    try{
        imagensNormalizadas = normalizarImagens(imagens)
    }
    catch(err){
        return res.status(400).json({message: err.message})
    }

    try{
        await db.transaction(async (transaction) => {
            const produto = await Produto.create(valores, {transaction})
            await ProdutoImagem.bulkCreate(
                imagensNormalizadas.map(imagem => ({...imagem, produto_id: produto.id})),
                {transaction}
            )
        })

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
            include: includeProduto
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
            include: includeProduto
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
    const { imagens, imagem_url, ...valores } = req.body

    if(imagem_url !== undefined){
        return res.status(400).json({message: 'Use o campo imagens como array; imagem_url nao pertence mais ao produto.'})
    }

    let imagensNormalizadas
    if(imagens !== undefined){
        try{
            imagensNormalizadas = normalizarImagens(imagens)
        }
        catch(err){
            return res.status(400).json({message: err.message})
        }
    }

    try{
        const produto = await Produto.findByPk(id)

        if(!produto){
            return res.status(404).json({message: `O Produto com id ${id} nao existe!`})
        }

        await db.transaction(async (transaction) => {
            await Produto.update(valores, {where: {id}, transaction})

            if(imagensNormalizadas){
                await ProdutoImagem.destroy({where: {produto_id: id}, transaction})
                await ProdutoImagem.bulkCreate(
                    imagensNormalizadas.map(imagem => ({...imagem, produto_id: id})),
                    {transaction}
                )
            }
        })

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
