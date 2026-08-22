const express = require('express')
const router = express.Router()
const produtosController = require('../controller/produtos.controller')
const adminMiddleware = require('../middleware/admin.middleware')

router.post('/cadastrar', adminMiddleware.onlyAdmin, produtosController.cadastrar)
router.get('/listar', produtosController.listar)
router.get('/consultar', produtosController.consultar)
router.delete('/apagar', adminMiddleware.onlyAdmin, produtosController.apagar)
router.put('/atualizar', produtosController.atualizar)

module.exports = router