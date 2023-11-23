const express = require('express')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({
    origin: '*'
}))

const usuario = require('./Router/UsuarioRouter')
const Admin =require('./Router/AdminRouter')


app.use('/usuario', usuario)
app.use('/administrador', Admin)






module.exports = app