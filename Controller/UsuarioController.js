const Usuario = require('../Models/UsuarioModel');
const {request,response} = require=('express');



// crear
const createUsuario = async (req = request, 
    res = response) => {
    try{
        const nombre = req.body.nombre
        
           
        const apellido = req.body.apellido 

            
        const labor=req.body.labor   
        const email=req.body.email    
            
        const UsuarioDB = await Usuario.findOne({nombre})
        
        if(UsuarioDB){
            return res.status(400).json({msg: 'Ya existe'})
        }
        const data = {
            nombre,
            apellido,
            labor,
            email
            
        }
        const usuario = new Usuario (data)
        console.log(usuario)
        await usuario.save()
        return res.status(201).json(usuario)
    }catch(e){
        return res.status(500).json({
            msg: 'Error general ' + e
        })
    }
}



const getUsuario = async (req = request, 
    res = response) => {
        try{
            
            const UsuarioDB = await Usuario.find()
            return res.json(UsuarioDB)
        }catch(e){
            return res.status(500).json({
                msg: 'Error general ' + e
            })
        }
}


//Actualizar
const updateUsuario = async (req = request,
    res = response) => {
    try{
        console.log(req.body)
        console.log(req.params)
        const data = req.body
        const id = req.params.id
       
        data.fechaActualizacion = new Date()
        console.log(data)
        const usuario = await Usuario.findByIdAndUpdate(id, data, {new: true})
        return res.json(usuario)
    }catch(e){
        console.log(e)
        return res.status(500).json({msg: e})  
    }
}

//Eliminar
const DeleteUsuario =(req = request, res = response) => {
    const {id} = req.params
    Usuario.findByIdAndDelete(id).then(result => {res.json(result)})
  
  }

module.exports = { 
    createUsuario,
    getUsuario, 
    updateUsuario,
    DeleteUsuario
}