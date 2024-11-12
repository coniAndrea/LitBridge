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


//CONFIGURACIÓN DE LAS NOTIFICACIÓN 

// CONFIGURACION DEL IDIOMA DE LA CUENTA --> IMPLEMENTACIÓN DE LA API PARA LA TRADUCCION 
   //solo permite seleccionar una opción 
   document.querySelectorAll('input[name="language"]').forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('input[name="language"]').forEach((otherCheckbox) => {
                if (otherCheckbox !== this) {
                    otherCheckbox.checked = false;
                }
            });
        }
    });
});

// traducir el contenido de otra pai con OpenAi 
async function traducirContenidoDeAPI() {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').id;

    try {
        // Hacer una solicitud a la API externa
        const responseAPI = await fetch("URL_DE_LA_OTRA_API");
        
        if (!responseAPI.ok) {
            throw new Error("Error al obtener contenido de la API externa");
        }

        const dataAPI = await responseAPI.json();
        const content = dataAPI.content || "Texto por defecto si no se encuentra 'content' en la respuesta";

        // Enviar el contenido a traducir al backend
        const responseTranslate = await fetch("/translate/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({ content, language: selectedLanguage })
        });

        const result = await responseTranslate.json();

        if (result.translated_text) {
            // Muestra el texto traducido en algún lugar de tu página
            document.getElementById("contenido-traducido").innerText = result.translated_text;
        } else {
            console.error("Error en la traducción:", result.error);
        }

    } catch (error) {
        console.error("Error al obtener o traducir el contenido:", error);
    }
}

  
//Captura la Selección de idioma

async function traducirPaginaCompleta() {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').id;
    const content = document.body.innerText;

    try{
        const response = await fetch("/translate/",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({content, language:selectedLanguage})
        });

        const result = await response.json();
        if (result.translated_text){
            document.body.innerHTML = result.translated_text;
        }else{
            console.error("Error en la traducción:", result.error);
        }
    }catch (error){
        console.error("Error al traduccir la página completa:", error);
    }
}

//función para obtenr el token CSRF
function getCookie(name){
    let cookieValue = null;
    if (document.cookie && document.cookie != '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')){
                cookieValue = decodeURIComponent(cookie.substring(name.length +1));
            }
        }
    }
    return cookieValue;
}