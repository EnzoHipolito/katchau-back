const Usuario = require('./Usuario')
const Categoria = require('./Categoria')
const Produto = require('./Produto')
const ProdutoImagem = require('./ProdutoImagem')
const Estoque = require('./Estoque')
const Pedido = require('./Pedido')
const ItemPedido = require('./ItemPedido')
const Entrega = require('./Entrega')

Categoria.hasMany(Produto, {
    foreignKey: 'categoria_id',
    as: 'produtos'
})
Produto.belongsTo(Categoria, {
    foreignKey: 'categoria_id',
    as: 'categoria'
})

Produto.hasMany(ProdutoImagem, {
    foreignKey: 'produto_id',
    as: 'imagens',
    onDelete: 'CASCADE'
})
ProdutoImagem.belongsTo(Produto, {
    foreignKey: 'produto_id',
    as: 'produto'
})

Produto.hasOne(Estoque, {
    foreignKey: 'produto_id',
    as: 'estoque'
})
Estoque.belongsTo(Produto, {
    foreignKey: 'produto_id',
    as: 'produto'
})

Usuario.hasMany(Pedido, {
    foreignKey: 'usuario_id',
    as: 'pedidos'
})
Pedido.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
})

Pedido.hasMany(ItemPedido, {
    foreignKey: 'pedido_id',
    as: 'itens'
})
ItemPedido.belongsTo(Pedido, {
    foreignKey: 'pedido_id',
    as: 'pedido'
})

Produto.hasMany(ItemPedido, {
    foreignKey: 'produto_id',
    as: 'itensPedido'
})
ItemPedido.belongsTo(Produto, {
    foreignKey: 'produto_id',
    as: 'produto'
})

Pedido.hasOne(Entrega, {
    foreignKey: 'pedido_id',
    as: 'entrega'
})
Entrega.belongsTo(Pedido, {
    foreignKey: 'pedido_id',
    as: 'pedido'
})

module.exports = {
    Usuario,
    Categoria,
    Produto,
    ProdutoImagem,
    Estoque,
    Pedido,
    ItemPedido,
    Entrega
}
