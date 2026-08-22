const express = require('express')
const router = express.Router()
const produtosController = require('../controller/produtos.controller')

router.post('/cadastrar', produtosController.cadastrar)
router.get('/listar', produtosController.listar)
router.get('/consultar', produtosController.consultar)
router.delete('/apagar', produtosController.apagar)
router.put('/atualizar', produtosController.atualizar)

module.exports = router