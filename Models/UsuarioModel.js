const {Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre requerido']
    },

    apellido: {
        type: String,
        required: [true, 'Apellido requerido']
    },

    labor: {
        type: String,
        required: [true, 'Labor requerido']
    },
    email: {
        type: String,
        required: [true, 'Email requerido'],
        unique: [true, 'Email debe ser único']
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

module.exports = model('Usuario',UsuarioSchema );