const { QueryTypes } = require('sequelize')
const db = require('../config/db')
const { ProdutoImagem } = require('../models')

const migrarImagensLegadas = async () => {
    const queryInterface = db.getQueryInterface()
    const colunasProduto = await queryInterface.describeTable('produtos')

    if(!colunasProduto.imagem_url){
        return
    }

    const produtos = await db.query(
        'SELECT id, imagem_url FROM produtos WHERE imagem_url IS NOT NULL AND TRIM(imagem_url) <> :urlVazia',
        {
            replacements: {urlVazia: ''},
            type: QueryTypes.SELECT
        }
    )

    await db.transaction(async (transaction) => {
        for(const produto of produtos){
            await ProdutoImagem.findOrCreate({
                where: {
                    produto_id: produto.id,
                    url: produto.imagem_url
                },
                defaults: {ordem: 0},
                validate: false,
                transaction
            })
        }
    })

    await queryInterface.removeColumn('produtos', 'imagem_url')
    console.log(`${produtos.length} imagem(ns) legada(s) migrada(s).`)
}

const sincronizarBanco = async () => {
    await db.sync()
    await migrarImagensLegadas()
}

module.exports = { sincronizarBanco }
