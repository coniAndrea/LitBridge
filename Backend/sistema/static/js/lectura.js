document.addEventListener('DOMContentLoaded', async () => {
    // Recuperar los datos del libro desde localStorage
    const bookData = JSON.parse(localStorage.getItem('currentBook'));

    if (bookData) {
        // Verificar y actualizar elementos del DOM si existen
        const bookTitleElem = document.getElementById('book-title');
        const bookAuthorElem = document.getElementById('book-author');
        const bookCoverElem = document.getElementById('book-cover');
        
        if (bookTitleElem) bookTitleElem.textContent = bookData.title || 'Título Desconocido';
        if (bookAuthorElem) bookAuthorElem.textContent = bookData.author || 'Autor Desconocido';
        if (bookCoverElem) bookCoverElem.src = bookData.image || '../img/default-cover.png';

        // Obtener detalles básicos del libro desde la API
        try {
            const bookDetails = await fetchBookDetails(bookData.id);
            console.log('Detalles del libro:', bookDetails);

            // Simular capítulos si la solicitud es exitosa
            const chapters = [
                { id: 'intro', title: 'Introducción' },
                { id: 'chap1', title: 'Capítulo 1' },
                { id: 'chap2', title: 'Capítulo 2' },
            ];
            populateChapterList(chapters);

            // Manejar la selección de capítulos
            const chapterSelectElem = document.getElementById('chapters');
            if (chapterSelectElem) {
                chapterSelectElem.addEventListener('change', async (event) => {
                    const selectedChapter = event.target.value;
                    if (selectedChapter) {
                        try {
                            const chapterContent = 'Vista previa simulada del capítulo seleccionado.'; // Simulación
                            const selectedChapterTitle = event.target.options[event.target.selectedIndex].textContent;
                            displayChapterContent(chapterContent, selectedChapterTitle);
                        } catch (error) {
                            console.error('Error al cargar el contenido del capítulo:', error);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error al obtener los detalles del libro:', error);
            const chapterContentElem = document.getElementById('chapter-content');
            if (chapterContentElem) {
                chapterContentElem.innerHTML = '<p>Error al obtener los detalles del libro. Verifique la consola para más detalles.</p>';
            }
        }
    } else {
        // Mensaje de error si no hay datos del libro
        const chapterContentElem = document.getElementById('chapter-content');
        if (chapterContentElem) {
            chapterContentElem.innerHTML = '<p>No se encontraron datos del libro.</p>';
        }
    }
});

// Función para obtener detalles básicos del libro desde la API de Google Books
async function fetchBookDetails(bookId) {
    const apiKey = 'AIzaSyCF7kNw4UhcY_oKBZK-Fy-T4HnagUP7RJ8'; // Reemplaza con tu clave
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Manejo de errores detallado
            if (response.status === 403) {
                throw new Error('Acceso denegado: Verifica las restricciones de tu clave de API.');
            } else if (response.status === 404) {
                throw new Error('Recurso no encontrado: El ID del libro no es válido.');
            } else {
                throw new Error(`Error inesperado: ${response.statusText} (${response.status})`);
            }
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Error en la solicitud a la API de Google Books: ${error.message}`);
    }
}

// Rellenar la lista desplegable con capítulos simulados
function populateChapterList(chapters) {
    const chapterSelect = document.getElementById('chapters');
    if (!chapterSelect) return; // Validar que exista el elemento

    chapterSelect.innerHTML = ''; // Limpiar lista existente

    chapters.forEach(chapter => {
        const option = document.createElement('option');
        option.value = chapter.id;
        option.textContent = chapter.title;
        chapterSelect.appendChild(option);
    });
}

// Mostrar el contenido del capítulo en la página
function displayChapterContent(content, title) {
    const chapterTitle = document.getElementById('chapter-title');
    const chapterText = document.getElementById('chapter-text');

    if (chapterTitle) chapterTitle.textContent = title || 'Capítulo Desconocido';
    if (chapterText) chapterText.textContent = content || 'No hay contenido disponible para este capítulo.';
}
