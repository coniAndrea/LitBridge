// Cargar libros en los géneros y carrusel
const carouselBooks = document.getElementById('carousel-books');
const genreBooks = document.getElementById('genre-books');

// Función para llamar a la API de Google Books y cargar libros en el contenedor
function fetchBooks(query, container) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; // Limpiamos el contenedor antes de cargar nuevos libros

            if (!data.items || data.items.length === 0) {
                // Si no hay libros, mostramos un mensaje
                const noBooksMessage = document.createElement('p');
                noBooksMessage.textContent = 'No se encontraron libros.';
                container.appendChild(noBooksMessage);
                return;
            }

            // Iteramos sobre los resultados de los libros
            data.items.forEach(item => {
                const book = document.createElement('img');
                // Verificamos si el libro tiene una imagen disponible, sino mostramos un placeholder
                book.src = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=Sin+imagen';
                book.alt = item.volumeInfo.title;
                book.classList.add('book'); // Agregamos clase para estilo
                // Al hacer clic, mostramos los detalles del libro
                book.onclick = () => showBookDetails(item.volumeInfo);
                container.appendChild(book); // Agregamos el libro al contenedor
            });
        })
        .catch(error => console.error('Error al cargar los libros:', error));
}

// Mostrar los detalles del libro en un modal
function showBookDetails(bookInfo) {
    const modal = document.getElementById('bookModal');
    const bookImage = document.getElementById('book-image');
    const bookTitle = document.getElementById('book-title');
    const bookDescription = document.getElementById('book-description');

    // Actualizamos los detalles del libro en el modal
    bookTitle.textContent = bookInfo.title || 'Título no disponible';

    const fullDescription = bookInfo.description || 'Descripción no disponible';
    const shortDescription = getShortDescription(fullDescription, 150); // Limitar descripción
    bookDescription.textContent = shortDescription;

    bookImage.src = bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/200x300?text=Sin+imagen';

    modal.style.display = 'block'; // Mostramos el modal
}

// Función para obtener las primeras N palabras de una descripción
function getShortDescription(description, maxWords) {
    const words = description.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return description;
}

// Función para agregar un libro a la biblioteca
function addToLibrary(book) {
    const libraryBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
    libraryBooks.push({
        title: book.title,
        author: book.authors?.join(', ') || 'Autor no disponible', // Aseguramos mostrar autores
        image: book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=Sin+imagen',
        link: book.infoLink || '#'
    });
    localStorage.setItem('libraryBooks', JSON.stringify(libraryBooks)); // Guardamos en localStorage
}

// Cerrar el modal al hacer clic en el botón de cerrar
function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// Llamadas para cargar libros en distintas secciones
fetchBooks('mystery', carouselBooks);  // Cargamos libros de misterio en el carrusel principal
fetchBooks('fantasy', genreBooks);     // Cargamos libros de fantasía en otra sección
fetchBooks('adventure', document.getElementById('adventure-books'));  // Ejemplo para otra sección
fetchBooks('werewolf', document.getElementById('werewolf-books'));
fetchBooks('vampire', document.getElementById('vampire-books'));
fetchBooks('classic', document.getElementById('classic-books'));
fetchBooks('fairy tales', document.getElementById('fairy-tales-books'));
fetchBooks('romance', document.getElementById('romance-books'));
fetchBooks('thriller', document.getElementById('thriller-books'));
fetchBooks('science fiction', document.getElementById('science-fiction-books'));


// Asignamos el evento para cerrar el modal
document.getElementById('closeModalBtn').onclick = closeModal;

// Función para mover el carrusel principal (recomendaciones)
function moveCarousel(direction) {
    const carousel = document.getElementById('carousel-books');
    const scrollAmount = carousel.offsetWidth; // El ancho visible del carrusel
    carousel.scrollBy({
        left: scrollAmount * direction, // Desplazar en la dirección indicada
        behavior: 'smooth' // Movimiento suave
    });
}

// Función para mover el carrusel en los géneros
function moveCarouselGenre(direction, containerId) {
    const carousel = document.getElementById(containerId);
    const scrollAmount = carousel.offsetWidth; // El ancho visible del carrusel
    carousel.scrollBy({
        left: scrollAmount * direction, // Desplazar en la dirección indicada
        behavior: 'smooth' // Movimiento suave
    });
}
