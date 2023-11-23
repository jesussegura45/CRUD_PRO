const { Router } = require('express')
const { createUsuario, getUsuario,  updateUsuario, DeleteUsuario} = require('../Controller/UsuarioController')

const router = Router()


router.post('/',createUsuario)
router.get('/', getUsuario)
router.put('/:id',updateUsuario)
router.delete('/:id', DeleteUsuario)


module.exports = router;