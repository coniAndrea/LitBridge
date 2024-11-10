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
                // Solo mostramos libros que tengan imagen y descripción
                if (item.volumeInfo.description && item.volumeInfo.imageLinks?.thumbnail) {
                    const book = document.createElement('img');
                    // Verificamos si el libro tiene una imagen disponible, sino mostramos un placeholder
                    book.src = item.volumeInfo.imageLinks.thumbnail;
                    book.alt = item.volumeInfo.title;
                    book.classList.add('book'); // Agregamos clase para estilo
                    // Al hacer clic, mostramos los detalles del libro
                    book.onclick = () => showBookDetails(item.volumeInfo);
                    container.appendChild(book); // Agregamos el libro al contenedor
                }
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
    const bookPriceInfo = document.getElementById('book-price-info'); // Referencia correcta
    const addToLibraryBtn = document.getElementById('addToLibraryBtn'); // Referencia al botón

    // Actualizamos los detalles del libro en el modal
    bookTitle.textContent = bookInfo.title || 'Título no disponible';

    const fullDescription = bookInfo.description || 'Descripción no disponible';
    const shortDescription = getShortDescription(fullDescription, 150); // Limitar descripción
    bookDescription.textContent = shortDescription;

    // Verificamos si el libro es gratuito
    const isFree = bookInfo.saleInfo?.saleability === 'FREE' || !bookInfo.saleInfo?.retailPrice;

    if (isFree) {
        bookPriceInfo.textContent = "Este libro es gratuito";
        bookPriceInfo.style.color = "green"; // Estilo para indicar que es gratuito
    } else {
        bookPriceInfo.textContent = "Este libro no es gratuito";
        bookPriceInfo.style.color = "red"; // Estilo para indicar que no es gratuito
    }

    // Verificamos si el libro tiene imagen disponible
    bookImage.src = bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/200x300?text=Sin+imagen';

    // Asignamos el evento al botón de agregar a la biblioteca
    addToLibraryBtn.onclick = function() {
        if (isFree) {
            addToLibrary(bookInfo); // Solo agregamos si el libro es gratuito
            closeModal(); // Cerramos el modal después de agregarlo
        } else {
            alert('Este libro no es gratuito y no puede ser agregado a tu biblioteca.');
        }
    };

    modal.style.display = 'block'; // Mostramos el modal
}

// Función para cerrar el modal al hacer clic en el botón de cerrar
function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// Asignamos el evento para cerrar el modal
document.getElementById('closeModalBtn').onclick = closeModal;

// Función para obtener las primeras N palabras de una descripción
function getShortDescription(description, maxWords) {
    const words = description.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return description;
}

// Función para agregar un libro a la biblioteca
function addToLibrary(bookInfo) {
    // Verificamos si el libro tiene descripción e imagen
    if (!bookInfo.description || !bookInfo.imageLinks?.thumbnail) {
        alert('El libro no tiene suficiente información para ser agregado a la biblioteca.');
        return; // Salimos si no tiene descripción o imagen
    }

    const libraryBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];

    // Verificamos si el libro ya está en la biblioteca
    const isBookInLibrary = libraryBooks.some(book => book.title === bookInfo.title);

    if (isBookInLibrary) {
        alert('Este libro ya está en tu biblioteca.');
        return; // Salimos si el libro ya está en la biblioteca
    }

    libraryBooks.push({
        title: bookInfo.title,
        author: bookInfo.authors?.join(', ') || 'Autor no disponible', // Aseguramos mostrar autores
        image: bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=Sin+imagen',
        link: bookInfo.infoLink || '#'
    });
    localStorage.setItem('libraryBooks', JSON.stringify(libraryBooks)); // Guardamos en localStorage
    alert('Libro agregado a la biblioteca');
}

// Llamadas para cargar libros en distintas secciones
fetchBooks('mystery', carouselBooks);  
fetchBooks('fantasy', genreBooks);    
fetchBooks('adventure', document.getElementById('adventure-books'));  
fetchBooks('werewolf', document.getElementById('werewolf-books'));
fetchBooks('vampire', document.getElementById('vampire-books'));
fetchBooks('classic', document.getElementById('classic-books'));
fetchBooks('fairy tales', document.getElementById('fairy-tales-books'));
fetchBooks('romance', document.getElementById('romance-books'));
fetchBooks('thriller', document.getElementById('thriller-books'));
fetchBooks('science fiction', document.getElementById('science-fiction-books'));

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
