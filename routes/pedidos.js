const express = require('express')
const router = express.Router()
const pedidosController = require('../controller/pedidos.controller')
const authMiddleware = require('../middleware/auth.middleware')
const adminMiddleware = require('../middleware/admin.middleware')

router.post('/cadastrar', authMiddleware, pedidosController.cadastrar)
router.post('/checkout', authMiddleware, pedidosController.cadastrar)
router.patch('/confirmar/:id', authMiddleware, adminMiddleware.onlyAdmin, pedidosController.confirmar)
router.patch('/concluir/:id', authMiddleware, adminMiddleware.onlyAdmin, pedidosController.concluir)
router.get('/listar', authMiddleware, adminMiddleware.onlyAdmin, pedidosController.listar)
router.get('/consultar/:id', authMiddleware, pedidosController.consultar)
router.delete('/apagar/:id', authMiddleware, adminMiddleware.onlyAdmin, pedidosController.apagar)
router.put('/atualizar/:id', authMiddleware, adminMiddleware.onlyAdmin, pedidosController.atualizar)
router.patch('/atualizar-parcial/:id', authMiddleware, adminMiddleware.onlyAdmin, pedidosController.atualizarParcial)

module.exports = router
