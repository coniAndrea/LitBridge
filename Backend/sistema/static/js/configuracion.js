function showSection(section) {
    const sections = document.querySelectorAll('.section');
    sections.forEach((sec) => {
        sec.style.display = 'none';
    });
    document.getElementById(section).style.display = 'block';

    const links = document.querySelectorAll('.settings-menu a');
    links.forEach((link) => {
        link.classList.remove('active');
    });
    const activeLink = Array.from(links).find(link => link.textContent.toLowerCase() === section);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

//CONFIGURACIÓN DE LA CUENTA

 //GUARDAR CAMBIO
async function guardarCambios() {
    //OBTENR VALORES DEL FORMULARIO
    const username = document.getElementById("username").Value;
    const password = document.getElementById("password").Value;
    const email = document.getElementById("email").Value;
    
    //ENVIA DATOS AL BACKEND

    try{
        const response = await fetch('/api/guardar-cambios',{
            method: 'POST',
            headers: {
                'content-type':'application/json'
            },
            body:JSON.stringify({username, password, email})
        });

        if (response.ok){
            alert('Cambios guardados con éxito');
        }else{
          alert('Error al guardar cambios');
        }
    }catch (error){
        console.error('Error en la solicitud:',error);
        alert('Error en la solicitud');
    }
}
 //CERRRAR CUENTA PARA SIEMPRE

async function cerrarCuenta(){
   //configuración antes de cerrar la cuenta
   const confirmacion =confirm('¿ Estás segura de que quieres cerrar tu cuenta? Esta acción es irrevarsible.')
    if(confirmacion){
        try{
            const response = await fetch('/api/cerrar-cuenta',{
                meethod: 'DELETE'
            });

            if(response.ok){
                alert('Cuenta cerrada con éxito');
                window.location.href='/logout';
            }else{
                alert('Error al eliminar la cuenta');
            }
        }catch (error){
            console.error('Error en la solicitus:', error);
            alert('Error en la solicitud');
        }
    }
}


//función para obtenr el token CSRF
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(`${name}=`)) {
            return decodeURIComponent(cookie.split('=')[1]);
        }
    }
    return null;
}


// CONFIGURACIÓN DE LAS NOTIFICACIONES 

/// CONFIGURACIÓN DEL IDIOMA DE LA CUENTA --> IMPLEMENTACIÓN DE LA API PARA LA TRADUCCION 
document.querySelectorAll('input[name="language"]').forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            document.querySelectorAll('input[name="language"]').forEach((otherCheckbox) => {
                if (otherCheckbox !== this) {
                    otherCheckbox.checked = false;
                }
            });
        }
    });
});

// Función para obtener el idioma seleccionado
function obtenerIdiomaSeleccionado() {
    const selectedCheckbox = document.querySelector('input[name="language"]:checked');
    if (!selectedCheckbox) {
        alert("Por favor selecciona un idioma.");
        return null;
    }
    return selectedCheckbox.id; // Devuelve el ID del idioma seleccionado
}

async function traducirContenido() {
    const selectedLanguage = obtenerIdiomaSeleccionado();
    if (!selectedLanguage) return;

    const content = "Texto de ejemplo a traducir"; // Reemplazar con el texto dinámico
    try {
        const response = await fetch('/api/traducir-texto/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ texto: content, idioma: selectedLanguage }),
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById("texto-traducido").innerText = data.traduccion;
        } else {
            alert("Error al traducir el contenido.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Añadir evento al botón de traducción
document.getElementById("btn-traducir").addEventListener("click", traducirContenido);


// Función para traducir todo el contenido de la página
async function traducirPaginaCompleta(selectedLanguage) {
    // Selecciona todos los elementos que pueden contener texto
    const elementsToTranslate = document.querySelectorAll(`
        h1, h2, h3, h4, h5, h6, p, span, label, a, button, option, 
        div, li, td, th, caption, figcaption, blockquote, pre, code
    `);

    for (const element of elementsToTranslate) {
        const originalContent = element.innerText;

        if (originalContent.trim() !== "") {
            const translatedText = await traducirConOpenAI(originalContent, selectedLanguage);
            if (translatedText) {
                element.innerText = translatedText; // Reemplazar el contenido traducido
            } else {
                console.error(`No se pudo traducir el elemento: ${element}`);
            }
        }
    }
}

// Función que se ejecuta al hacer clic en el botón "Guardar"
async function guardarCambios() {
    const selectedLanguage = obtenerIdiomaSeleccionado();
    if (!selectedLanguage) return;

    // Traducir el contenido de la API externa
    await traducirContenidoDeAPI(selectedLanguage);
    
    // Traducir toda la página
    await traducirPaginaCompleta(selectedLanguage);

    alert("Traducción completada.");
}