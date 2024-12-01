// Obtener los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const bookTitle = decodeURIComponent(urlParams.get('title') || 'Título no disponible');
const bookAuthor = decodeURIComponent(urlParams.get('author') || 'Autor no disponible');
const bookDescription = decodeURIComponent(urlParams.get('description') || 'Descripción no disponible.');
const bookImage = decodeURIComponent(urlParams.get('image') || '../img/default-cover.png');

// Actualizar la información inicial del libro
document.getElementById('book-title').textContent = bookTitle;
document.getElementById('book-author').textContent = bookAuthor;
document.getElementById('book_description').value = bookDescription;
document.getElementById('book-cover').src = bookImage;

// Manejar errores de imagen
const bookCover = document.getElementById('book-cover');
bookCover.onerror = () => { bookCover.src = '../img/default-cover.png'; };
bookCover.src = bookImage;

// Función para procesar traducciones
function parseTranslations(data) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");
    const texts = xmlDoc.getElementsByTagName("text");
    const translations = {};
    for (let i = 0; i < texts.length; i++) {
        const id = texts[i].getAttribute("id");
        const text = texts[i].textContent;
        translations[id] = text;
    }
    return translations;
}

// Función para obtener traducciones
async function fetchTranslations(idioma, descripcion, titulo) {
    try {
        const response = await fetch(`/generar_traducciones/?idioma=${idioma}&descripcion=${encodeURIComponent(descripcion)}&titulo=${encodeURIComponent(titulo)}`);
        const data = await response.text();
        const translations = parseTranslations(data);

        // Actualizar los textos en la página
        document.getElementById('book-title').textContent = translations['book_title']; // Traducción dinámica del título
        document.getElementById('book-author').textContent = translations['book_author'];
        document.getElementById('texto-traducido').textContent = translations['book_description']; // Traducción dinámica de la descripción
        document.getElementById('btn-traducir').textContent = translations['traducir_button'];
    } catch (error) {
        console.error('Error al cargar el archivo XML:', error);
        alert('Ocurrió un error al traducir el contenido.');
    }
}

// Listener para el botón de traducir
document.getElementById('btn-traducir').addEventListener('click', async function() {
    const idioma = document.querySelector('input[name="idioma"]:checked')?.value;
    if (!idioma) {
        alert("Por favor, selecciona un idioma.");
        return;
    }

    const descripcion = document.getElementById('book_description').value; // Obtener la descripción actual
    const titulo = document.getElementById('book-title').textContent; // Obtener el título actual
    await fetchTranslations(idioma, descripcion, titulo);
});

