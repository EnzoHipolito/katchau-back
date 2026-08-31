const express = require('express')
const router = express.Router()
const itensPedidoController = require('../controller/itensPedido.controller')
const authMiddleware = require('../middleware/auth.middleware')
const adminMiddleware = require('../middleware/admin.middleware')

router.post('/cadastrar', authMiddleware, adminMiddleware.onlyAdmin, itensPedidoController.cadastrar)
router.get('/listar', authMiddleware, adminMiddleware.onlyAdmin, itensPedidoController.listar)
router.get('/consultar/:id', authMiddleware, adminMiddleware.onlyAdmin, itensPedidoController.consultar)
router.delete('/apagar/:id', authMiddleware, adminMiddleware.onlyAdmin, itensPedidoController.apagar)
router.put('/atualizar/:id', authMiddleware, adminMiddleware.onlyAdmin, itensPedidoController.atualizar)
router.patch('/atualizar-parcial/:id', authMiddleware, adminMiddleware.onlyAdmin, itensPedidoController.atualizarParcial)

module.exports = router
