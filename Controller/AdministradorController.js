const Administrador = require('../Models/AdministradorModel');
const {request,response} = require=('express');



// crear
const createAdmin = async (req = request, 
    res = response) => {
    try{
        const nombre = req.body.nombre
        
            
        const email=req.body.email  
        const contraseña =req.body.contraseña   
            
        
        const AdminDB = await Administrador.findOne({nombre})
        
        if(AdminDB){
            return res.status(400).json({msg: 'Ya existe'})
        }
        const data = {
            nombre,
            email,
            contraseña
        }
        const Admin = new Administrador (data)
        console.log(Admin)
        await Admin.save()
        return res.status(201).json(Admin)
    }catch(e){
        return res.status(500).json({
            msg: 'Error general ' + e
        })
    }
}


//Listar
const getAdministrador = async (req = request, 
    res = response) => {
        try{
            
            const AdminDB = await Administrador.find()
            return res.json(AdminDB)
        }catch(e){
            return res.status(500).json({
                msg: 'Error general ' + e
            })
        }
}


//Actualizar
const updateAdministrador = async (req = request,
    res = response) => {
    try{
        console.log(req.body)
        console.log(req.params)
        const data = req.body
        const id = req.params.id
       
        data.fechaActualizacion = new Date()
        console.log(data)
        const Admin = await Administrador.findByIdAndUpdate(id, data, {new: true})
        return res.json(Admin)
    }catch(e){
        console.log(e)
        return res.status(500).json({msg: e})  
    }
}

//Eliminar
const DeleteAdministrador =(req = request, res = response) => {
    const {id} = req.params
    Administrador.findByIdAndDelete(id).then(result => {res.json(result)})
  
  }

module.exports = { 
    createAdmin,
    getAdministrador, 
    updateAdministrador,
    DeleteAdministrador
}