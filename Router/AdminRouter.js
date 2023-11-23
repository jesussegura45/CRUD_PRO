const { Router } = require('express')
const { createAdmin, getAdministrador,updateAdministrador, DeleteAdministrador} = require('../Controller/AdministradorController')

const router = Router()


router.post('/',createAdmin)
router .get('/',getAdministrador)
router.put('/:id',updateAdministrador )
router.delete('/:id', DeleteAdministrador)


module.exports = router;