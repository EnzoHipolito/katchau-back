const { DataTypes } = require('sequelize')
const db = require('../config/db')

const Usuario = db.define('usuarios', {
    codUsuario:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING(120),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    senha:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cpf:{
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true
    },
    cep:{
        type: DataTypes.STRING(8),
    },
    rua:{
        type: DataTypes.STRING(70),
    },
    numero:{
        type: DataTypes.INTEGER,
    },
    complemento:{
        type: DataTypes.STRING(30),
    },
    bairro:{
        type: DataTypes.STRING(30),
    },
    cidade:{
        type: DataTypes.STRING(30),
    }
},{
    timestamps: true,
    tableName: 'usuarios'
})

module.exports = Usuario;