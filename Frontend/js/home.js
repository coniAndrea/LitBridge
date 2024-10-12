const carouselBooks = document.getElementById('carousel-books');
const genreBooks = document.getElementById('genre-books');

// Función para llamar a la API de Google Books y cargar libros en el contenedor
function fetchBooks(query, container) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; // Limpiamos el contenedor

            // Iteramos sobre los resultados de los libros
            data.items.forEach(item => {
                const book = document.createElement('img');
                book.src = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=Sin+imagen';
                book.alt = item.volumeInfo.title;
                book.classList.add('book');
                book.onclick = () => showBookDetails(item.volumeInfo);  // Mostrar detalles del libro en el modal
                container.appendChild(book);
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

    // Actualizar los detalles del libro en el modal
    bookTitle.textContent = bookInfo.title;

    // Filtramos solo la trama de la descripción
    const fullDescription = bookInfo.description || 'Descripción no disponible';
    
    // Limitar la descripción a las primeras 150 palabras (o ajustar según sea necesario)
    const shortDescription = getShortDescription(fullDescription, 150);
    bookDescription.textContent = shortDescription;  // Mostrar solo la trama resumida
    
    bookImage.src = bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/200x300?text=Sin+imagen';

    modal.style.display = 'block';  // Mostramos la ventana modal
}

// Función para obtener las primeras N palabras de una descripción
function getShortDescription(description, maxWords) {
    // Dividimos la descripción en palabras
    const words = description.split(' ');

    // Si la descripción tiene más palabras que el máximo permitido, la cortamos
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';  // Añadimos "..." al final
    }
    
    // Si no tiene más palabras que el máximo, devolvemos la descripción completa
    return description;
}

// Cerrar el modal
function closeModal() {
    console.log("Cerrar modal");  // Verifica si se ejecuta
    document.getElementById('bookModal').style.display = 'none';
}


// Cargar libros en las secciones de Recomendaciones y Fantasía
fetchBooks('mystery', carouselBooks);  // Cargamos libros de misterio en Recomendaciones
fetchBooks('fantasy', genreBooks);  // Cargamos libros de fantasía en la sección de Fantasía

// Llamada a la API de Google Books para cada género
fetchBooks('adventure', document.getElementById('adventure-books'));
fetchBooks('werewolf', document.getElementById('werewolf-books'));
fetchBooks('vampire', document.getElementById('vampire-books'));
fetchBooks('classic', document.getElementById('classic-books'));
fetchBooks('fairy tales', document.getElementById('fairy-tales-books'));
fetchBooks('romance', document.getElementById('romance-books'));
fetchBooks('thriller', document.getElementById('thriller-books'));
fetchBooks('science fiction', document.getElementById('science-fiction-books'));

// Función para mover el carrusel de cada género
function moveCarouselGenre(direction, genreId) {
    const genreBooks = document.getElementById(genreId);
    const scrollAmount = direction * 300;
    genreBooks.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// Función para mover el carrusel de Recomendaciones
function moveCarousel(direction) {
    const scrollAmount = direction * 300;  // Ajusta el desplazamiento según el tamaño
    carouselBooks.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// Función para mover el carrusel de cada género
function moveCarouselGenre(direction, carouselId) {
    const carousel = document.getElementById(carouselId);
    const scrollAmount = direction * 300;  // Ajusta el desplazamiento según el tamaño
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// Eventos para cerrar el modal
document.getElementById('closeModalBtn').onclick = closeModal;
window.onclick = function(event) {
    const modal = document.getElementById('bookModal');
    if (event.target == modal) {
        closeModal();
    }
};

// Función para agregar un libro a la biblioteca
function addToLibrary() {
    const bookTitle = document.getElementById('book-title').textContent;
    const bookDescription = document.getElementById('book-description').textContent;
    const bookImage = document.getElementById('book-image').src;

    // Suponiendo que la biblioteca es un array en el almacenamiento local del navegador
    let library = JSON.parse(localStorage.getItem('userLibrary')) || [];  // Recupera la biblioteca desde localStorage
    const book = { title: bookTitle, description: bookDescription, image: bookImage };  // Objeto libro
    library.push(book);  // Agrega el libro al array

    // Guarda la biblioteca actualizada en el almacenamiento local
    localStorage.setItem('userLibrary', JSON.stringify(library));

    // Cerrar el modal después de agregar
    closeModal();
}

