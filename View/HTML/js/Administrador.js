const backendURL='http://localhost:7000/administrador/';

// Función para cargar los usuarios al cargar la página
window.onload = function(){
    cargarAdministrador();
};


// Función para obtener el elemento tbody de la tabla
function obtenerTabla() {
    return document.getElementById('adminTable').getElementsByTagName('tbody')[0];
}

// Función para cargar usuarios desde el backend y almacenarlos localmente
function cargarAdministrador() {
    const adminGuardados = JSON.parse(localStorage.getItem('administradores')) || [];

    if (adminGuardados.length > 0) {
        
        adminGuardados.forEach(administrador => agregarFilaATabla(administrador));
    } else {
       
        solicitarAdminAlBackend();
    }
}

function obtenerAdminLocalmente() {
    return JSON.parse(localStorage.getItem('administradores')) || [];
}

function cargarTabla(data) {
    limpiarTabla();
    localStorage.setItem('administradores', JSON.stringify(data));
    data.forEach(administrador => agregarFilaATabla(administrador));
}

function solicitarAdminAlBackend() {
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

function limpiarTabla() {
    const tabla = obtenerTabla();
    tabla.innerHTML = '';
}

function agregarFilaATabla(administrador) {
    const tabla = obtenerTabla();
    const fila = tabla.insertRow();

    const celdas = [
       
         
        
        administrador.nombre,
        administrador.email,
        administrador.contraseña,
        `<button type="button" onclick="actualizarAdministrador('${administrador._id}')">Actualizar</button>
        <button type="button" onclick="eliminarAdmin('${administrador._id}')">Eliminar</button>`
    ];
    
    celdas.forEach((valor, index) => {
        const celda = fila.insertCell(index);
        celda.innerHTML = valor;
    });
}

function crearAdministrador() {
    const nombre = document.getElementById('adminName').value;
    const email = document.getElementById('adminEmail').value;
    const contraseña = document.getElementById('adminPassword').value;

    fetch(backendURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre,email,contraseña }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La respuesta del servidor no es válida');
        }
        return response.json();    
    })
    .then(data => {

        agregarFilaATabla(data);

        // Actualizar los datos almacenados localmente
        const guardarAdmin = obtenerAdminLocalmente();
        localStorage.setItem('administradores', JSON.stringify([...guardarAdmin, data]));
    })
    .catch(error => console.error('Error:', error));
}

//Función para actualizar un administrador
function actualizarAdministrador(id) {
    // Obtener los nuevos valores del usuario desde la interfaz gráfica
    const nuevoNombre = prompt('Ingrese el nuevo nombre:');
    const nuevoEmail = prompt('Ingrese el nuevo email:');
    const nuevaContraseña = prompt('Ingrese la nueva contraseña:');

    // Realizar la solicitud 
    fetch(`${backendURL}${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nuevoNombre,
            email: nuevoEmail,
            contraseña: nuevaContraseña,
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
        const administradoresGuardados = obtenerAdminLocalmente();
        const index = administradoresGuardados.findIndex(administrador => administrador._id === id);
        if (index !== -1) {
            administradoresGuardados[index] = data;
            localStorage.setItem('administradores', JSON.stringify(administradoresGuardados));
        }
    })
    .catch(error => console.error('Error:', error));
}

// Función para actualizar la fila en la tabla con los nuevos datos del usuario
function actualizarFilaEnTabla(id, administrador) {
    const tabla = obtenerTabla();
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        if (celdas.length > 0 && celdas[0].innerHTML === id) {
            // Actualizar la fila con los nuevos datos del usuario
            celdas[0].innerHTML = usuario._id;
            celdas[1].innerHTML = usuario.nombre;
            celdas[2].innerHTML = usuario.email;
            celdas[3].innerHTML = usuario.contraseña;
            break;
        }
    }
}

function eliminarAdmin(id) {
    // Confirmar con el usuario antes de eliminar al administrador
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este administrador?');

    if (confirmacion) {
        // Realizar la solicitud al backend para eliminar al administrador
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
            // Eliminar la fila correspondiente en la tabla
            eliminarFilaDeTabla(id);

            // Actualizar los datos almacenados localmente eliminando al administrador
            const administradoresGuardados = obtenerAdminLocalmente();
            const nuevosAdmins = administradoresGuardados.filter(admin => admin._id !== id);
            localStorage.setItem('administradores', JSON.stringify(nuevosAdmins));
        })
        .catch(error => console.error('Error:', error));
    }
}

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
