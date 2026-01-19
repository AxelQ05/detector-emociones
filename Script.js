let mostrarTodo = false;

// 1. Mostrar Historial
function mostrarHistorialLocalStorage() {
    const listaUI = document.getElementById('lista-global-usuarios');
    const btnMas = document.getElementById('btn-mostrar-mas');
    const btnVolver = document.getElementById('btn-volver');
    
    if (!listaUI) return;

    // Recuperamos datos
    const datos = JSON.parse(localStorage.getItem('historialProyectos')) || [];
    
    // Limpiamos la UI antes de renderizar (CLAVE para que no se dupliquen)
    listaUI.innerHTML = ""; 

    // Si no hay datos, ocultamos botones y salimos
    if (datos.length === 0) {
        listaUI.innerHTML = "<p style='opacity:0.5; font-size:0.9rem;'>No hay registros aún.</p>";
        if(btnMas) btnMas.style.display = "none";
        if(btnVolver) btnVolver.style.display = "none";
        return;
    }
    
    // Lógica de corte: O mostramos TODO, o solo los últimos 5
    // Usamos [...datos] para hacer una copia y no dañar el original al revertir
    const copiaDatos = [...datos].reverse();
    const registrosAExhibir = mostrarTodo ? copiaDatos : copiaDatos.slice(0, 5);

    // Renderizado
    registrosAExhibir.forEach(user => {
        const li = document.createElement('li');
        
        li.style.padding = "15px";
        li.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        li.style.listStyle = "none";
        li.style.textAlign = "left";
        li.style.fontSize = "0.85rem";

        let fechaLimpia = user.fecha ? user.fecha.replace('T', ' ') : "Sin fecha";

        li.innerHTML = `
            <div style="color: #00d2ff; font-weight: 600; margin-bottom: 5px;">
                ✅ ${user.nombre ? user.nombre.toUpperCase() : 'ANÓNIMO'}
            </div>
            <div style="opacity: 0.8; color: white;">
                <span>📅 <strong>Fecha:</strong> ${fechaLimpia}</span><br>
                <span>🎂 <strong>Edad:</strong> ${user.edad || '--'} años</span> | 
                <span>🎓 <strong>Curso:</strong> ${user.curso || '--'}</span>
            </div>
        `;
        listaUI.appendChild(li);
    });

    // Control de Botones
    if (datos.length > 5) {
        if (mostrarTodo) {
            btnMas.style.display = "none";
            btnVolver.style.display = "flex"; // Usamos flex para centrar íconos
        } else {
            btnMas.style.display = "flex";
            btnVolver.style.display = "none";
        }
    } else {
        btnMas.style.display = "none";
        btnVolver.style.display = "none";
    }
}

// 2. Funciones de los botones
function verMas() {
    mostrarTodo = true;
    mostrarHistorialLocalStorage();
}

function volverAlInicio() {
    mostrarTodo = false;
    mostrarHistorialLocalStorage();
    // Truco: Hacemos scroll suave hacia el título de la lista para que el usuario vea el cambio
    document.getElementById('historial-global').scrollIntoView({ behavior: 'smooth' });
}

// 3. Carga inicial
window.addEventListener('load', function() {
    mostrarHistorialLocalStorage();
    
    const fechaInput = document.getElementById('fecha-hora');
    if (fechaInput) {
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        fechaInput.value = ahora.toISOString().slice(0, 16);
    }
});

// 4. Registro
const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault();

        const usuarioActual = {
            nombre: document.getElementById('nombre').value,
            edad: document.getElementById('edad').value,
            curso: document.getElementById('curso').value,
            fecha: document.getElementById('fecha-hora').value
        };

        let listaUsuarios = JSON.parse(localStorage.getItem('historialProyectos')) || [];
        listaUsuarios.push(usuarioActual);
        localStorage.setItem('historialProyectos', JSON.stringify(listaUsuarios));

        localStorage.setItem('sistemaActivo', 'true');
        window.location.href = "Monitor.html";
    });
}

// 5. Limpiar
function limpiarHistorial() {
    if (confirm("¿Seguro borras todo? Se irán todos los registros.")) {
        localStorage.removeItem('historialProyectos');
        mostrarTodo = false;
        mostrarHistorialLocalStorage();
    }
}