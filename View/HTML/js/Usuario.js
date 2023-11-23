const backendURL = 'http://localhost:7000/usuario/';

// Función para cargar los usuarios al cargar la página
window.onload = function () {
    cargarUsuarios();
};

// Función para obtener el elemento tbody de la tabla
function obtenerTabla() {
    return document.getElementById('userTable').getElementsByTagName('tbody')[0];
}

// Función para cargar usuarios desde el backend y almacenarlos localmente
function cargarUsuarios() {
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuariosGuardados.length > 0) {
        // Si hay datos almacenados localmente, cargarlos en la tabla
        usuariosGuardados.forEach(usuario => agregarFilaATabla(usuario));
    } else {
        // Si no hay datos almacenados localmente, hacer la solicitud al backend
        solicitarUsuariosAlBackend();
    }
}

// Función para obtener usuarios almacenados localmente
function obtenerUsuariosLocalmente() {
    return JSON.parse(localStorage.getItem('usuarios')) || [];
}

// Función para cargar la tabla con datos y almacenarlos localmente
function cargarTabla(data) {
    limpiarTabla();
    localStorage.setItem('usuarios', JSON.stringify(data));
    data.forEach(usuario => agregarFilaATabla(usuario));
}

// Función para solicitar usuarios al backend
function solicitarUsuariosAlBackend() {
    fetch(backendURL )
        .then(response => {
            if (!response.ok) {
                throw new Error('La respuesta del servidor no es válida');
            }
            return response.json();
        })
        .then(data => cargarTabla(data))
        .catch(error => console.error('Error en la solicitud:', error));
}

// Función para limpiar la tabla
function limpiarTabla() {
    const tabla = obtenerTabla();
    tabla.innerHTML = '';
}

// Función para agregar una fila a la tabla con los datos del usuario
function agregarFilaATabla(usuario) {
    const tabla = obtenerTabla();
    const fila = tabla.insertRow();

    const celdas = [
       
       
        usuario.nombre,
        usuario.apellido,
        usuario.labor,
        usuario.email,
        `<button type="button" onclick="actualizarUsuario('${usuario._id}')">Actualizar</button>
        <button type="button" onclick="eliminarUsuario('${usuario._id}')">Eliminar</button>`
    ];
    
    celdas.forEach((valor, index) => {
        const celda = fila.insertCell(index);
        celda.innerHTML = valor;
    });
}

// Función para crear un nuevo usuario
function crearUsuario() {
    const nombre = document.getElementById('userName').value;
    const apellido = document.getElementById('userLastName').value;
    const labor = document.getElementById('userJob').value;
    const email = document.getElementById('userEmail').value;

    fetch(backendURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellido, labor, email }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La respuesta del servidor no es válida');
        }
        return response.json();
    })
    .then(data => {
        // Agregar la nueva fila a la tabla con los datos del nuevo usuario
        agregarFilaATabla(data);

        // Actualizar los datos almacenados localmente
        const usuariosGuardados = obtenerUsuariosLocalmente();
        localStorage.setItem('usuarios', JSON.stringify([...usuariosGuardados, data]));
    })
    .catch(error => console.error('Error:', error));
}

//Función para actualizar un usuario
function actualizarUsuario(id) {
    // Obtener los nuevos valores del usuario desde la interfaz gráfica
    const nuevoNombre = prompt('Ingrese el nuevo nombre:');
    const nuevoApellido = prompt('Ingrese el nuevo apellido:');
    const nuevaLabor = prompt('Ingrese la nueva labor:');
    const nuevoEmail = prompt('Ingrese el nuevo email:');

    // Realizar la solicitud 
    fetch(`${backendURL}${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nuevoNombre,
            apellido: nuevoApellido,
            labor: nuevaLabor,
            email: nuevoEmail,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La respuesta del servidor no es válida');
        }
        return response.json();
    })
    .then(data => {
        // Actualizar la fila en la tabla con los nuevos datos del usuario
        actualizarFilaEnTabla(id, data);

        // Actualizar los datos almacenados localmente
        const usuariosGuardados = obtenerUsuariosLocalmente();
        const index = usuariosGuardados.findIndex(usuario => usuario._id === id);
        if (index !== -1) {
            usuariosGuardados[index] = data;
            localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));
        }
    })
    .catch(error => console.error('Error:', error));
}

// Función para actualizar la fila en la tabla con los nuevos datos del usuario
function actualizarFilaEnTabla(id, usuario) {
    const tabla = obtenerTabla();
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        if (celdas.length > 0 && celdas[0].innerHTML === id) {
            // Actualizar la fila con los nuevos datos del usuario
            celdas[0].innerHTML = usuario._id;
            celdas[1].innerHTML = usuario.nombre;
            celdas[2].innerHTML = usuario.apellido;
            celdas[3].innerHTML = usuario.labor;
            celdas[4].innerHTML = usuario.email;
            break;
        }
    }
}


// Función para eliminar un usuario
function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        // Realizar la solicitud DELETE al backend
        fetch(backendURL + id, {
            method: 'DELETE',
            //
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La respuesta del servidor no es válida');
            }
            return response.json();
        })
        .then(data => {
            // Eliminar la fila de la tabla con el usuario eliminado
            eliminarFilaDeTabla(id);

            // Actualizar los datos almacenados localmente
            const usuariosGuardados = obtenerUsuariosLocalmente();
            const nuevosUsuarios = usuariosGuardados.filter(usuario => usuario._id !== id);
            localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
        })
        .catch(error => console.error('Error:', error));
    }
}

// Función para eliminar la fila de la tabla con el usuario eliminado
function eliminarFilaDeTabla(id) {
    const tabla = obtenerTabla();
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        if (celdas.length > 0 && celdas[0].innerHTML === id) {
            // Eliminar la fila de la tabla
            tabla.deleteRow(i);
            break;
        }
    }
}



// Función para eliminar un usuario
function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        // Realizar la solicitud DELETE al backend
        fetch(`${backendURL}${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La respuesta del servidor no es válida');
            }
            return response.json();
        })
        .then(() => {
            // Eliminar la fila de la tabla con el usuario eliminado
            eliminarFilaDeTabla(id);

            // Actualizar los datos almacenados localmente
            const usuariosGuardados = obtenerUsuariosLocalmente();
            const nuevosUsuarios = usuariosGuardados.filter(usuario => usuario._id !== id);
            localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
        })
        .catch(error => console.error('Error:', error));
    }
}

// Función para eliminar la fila de la tabla con el usuario eliminado
function eliminarFilaDeTabla(id) {
    const tabla = obtenerTabla();
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        if (celdas.length > 0 && celdas[0].innerHTML === id) {
            // Eliminar la fila de la tabla
            tabla.deleteRow(i);
            break;
        }
    }
}




