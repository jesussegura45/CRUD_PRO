const {Schema, model} = require('mongoose')

const AdministradorSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre requerido']
    },
    email: {
        type: String,
        required: [true, 'Email requerido'],
        unique: [true, 'Email debe ser único']
    },

    contraseña: {
        type: String,
        required: [true, 'Contraseña requerido'],
        unique: [true, 'Contraseña debe ser única']
    },

    fechaCreacion: {
        type: Date,
        default: new Date()
    },
    fechaActualizacion: {
        type: Date,
        default: new Date()
    }
})

module.exports = model('Administrador',AdministradorSchema);