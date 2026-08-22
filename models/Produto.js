const { DataTypes } = require('sequelize')
const db = require('../config/db')

const Produtos = db.define('produtos', {
    codProduto:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    categoria:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descricao:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    precoUnidade:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    imagem_url:{
        type: DataTypes.STRING(500),
        allowNull: false
    },
    porcentagemDesconto:{
        type: DataTypes.INTEGER,
    },
},{
    timestamps: true,
    tableName: 'produtos'
})

module.exports = Produtos;