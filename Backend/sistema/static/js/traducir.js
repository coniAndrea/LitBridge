// CONFIGURACIÓN DEL IDIOMA DE LA CUENTA
// Solo permite seleccionar una opción
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

// Traducir el contenido de otra API con OpenAI
async function traducirContenidoDeAPI() {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').id;

    try {
        // Hacer una solicitud a la API de libros de Google
        const responseAPI = await fetch("https://www.googleapis.com/books/v1/volumes?q=harry+potter");
        if (!responseAPI.ok) {
            throw new Error("Error al obtener contenido de la API externa");
        }

        const dataAPI = await responseAPI.json();
        const content = dataAPI.items[0]?.volumeInfo?.description || "Contenido no encontrado";

        // Solicitar la traducción del contenido a OpenAI
        const responseTranslate = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer YOUR_OPENAI_API_KEY` // Reemplaza con tu clave de OpenAI
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `Eres un traductor experto. Traduce el texto al idioma ${selectedLanguage}.` },
                    { role: "user", content }
                ]
            })
        });

        const result = await responseTranslate.json();

        if (result.choices && result.choices[0]?.message?.content) {
            // Mostrar el texto traducido en la página
            document.getElementById("contenido-traducido").innerText = result.choices[0].message.content;
        } else {
            console.error("Error en la traducción:", result);
        }

    } catch (error) {
        console.error("Error al obtener o traducir el contenido:", error);
    }
}

// Traducir el contenido completo de la página con OpenAI
async function traducirPaginaCompleta() {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').id;
    const content = document.body.innerText;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer YOUR_OPENAI_API_KEY` // Reemplaza con tu clave de OpenAI
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `Eres un traductor experto. Traduce el texto al idioma ${selectedLanguage}.` },
                    { role: "user", content }
                ]
            })
        });

        const result = await response.json();

        if (result.choices && result.choices[0]?.message?.content) {
            document.body.innerHTML = result.choices[0].message.content;
        } else {
            console.error("Error en la traducción:", result);
        }
    } catch (error) {
        console.error("Error al traducir la página completa:", error);
    }
}

// Función para obtener el token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie != '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
    }
    return cookieValue;
}


// Obtener los idiomas seleccionados
function obtenerIdiomaSeleccionado() {
    const checkboxes = document.querySelectorAll('input[name="language"]:checked');
    if (checkboxes.length === 0) {
        alert("Por favor selecciona un idioma.");
        return null;
    }
    return Array.from(checkboxes).map(checkbox => checkbox.id);
}

// Traducir el contenido de la API de Google Books
async function traducirContenidoDeAPI(selectedLanguage) {
    try {
        // Hacer una solicitud a la API de libros de Google
        const responseAPI = await fetch("https://www.googleapis.com/books/v1/volumes?q=harry+potter");
        if (!responseAPI.ok) {
            throw new Error("Error al obtener contenido de la API externa");
        }

        const dataAPI = await responseAPI.json();
        const content = dataAPI.items[0]?.volumeInfo?.description || "Contenido no encontrado";

        // Solicitar la traducción del contenido a OpenAI
        const responseTranslate = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer TU_API_KEY_DE_OPENAI`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `Eres un traductor experto. Traduce el texto al idioma ${selectedLanguage}.` },
                    { role: "user", content }
                ]
            })
        });

        const result = await responseTranslate.json();

        if (result.choices && result.choices[0]?.message?.content) {
            // Mostrar el texto traducido en la página
            document.getElementById("contenido-traducido").innerText = result.choices[0].message.content;
        } else {
            console.error("Error en la traducción:", result);
        }
    } catch (error) {
        console.error("Error al obtener o traducir el contenido:", error);
    }
}

// Traducir el contenido completo de la página con OpenAI
async function traducirPaginaCompleta(selectedLanguage) {
    const content = document.body.innerText;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer TU_API_KEY_DE_OPENAI`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `Eres un traductor experto. Traduce el texto al idioma ${selectedLanguage}.` },
                    { role: "user", content }
                ]
            })
        });

        const result = await response.json();

        if (result.choices && result.choices[0]?.message?.content) {
            document.body.innerHTML = result.choices[0].message.content;
        } else {
            console.error("Error en la traducción:", result);
        }
    } catch (error) {
        console.error("Error al traducir la página completa:", error);
    }
}

// Evento al presionar el botón "Guardar"
document.querySelector(".submit-btn").addEventListener("click", async () => {
    const idiomasSeleccionados = obtenerIdiomaSeleccionado();
    if (!idiomasSeleccionados) return;

    // Procesar cada idioma seleccionado
    for (const idioma of idiomasSeleccionados) {
        await traducirContenidoDeAPI(idioma);
        await traducirPaginaCompleta(idioma);
    }

    alert("Traducción completada.");
});
