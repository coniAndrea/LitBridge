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
                const noBooksMessage = document.createElement('p');
                noBooksMessage.textContent = 'No se encontraron libros.';
                container.appendChild(noBooksMessage);
                return;
            }

            data.items.forEach(item => {
                // Asegúrate de incluir información de precios si está disponible
                const saleInfo = item.saleInfo;
                const bookData = {
                    title: item.volumeInfo.title,
                    authors: item.volumeInfo.authors,
                    imageLinks: item.volumeInfo.imageLinks,
                    infoLink: item.volumeInfo.infoLink,
                    description: item.volumeInfo.description || 'Descripción no disponible',
                    saleInfo: saleInfo  // Agrega la información de ventas aquí
                };

                const bookElement = document.createElement('img');
                bookElement.src = bookData.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=Sin+imagen';
                bookElement.alt = bookData.title;
                bookElement.classList.add('book');
                bookElement.onclick = () => showBookDetails(bookData); // Mostrar detalles al hacer clic
                container.appendChild(bookElement);
            });
        })
        .catch(error => console.error('Error al cargar los libros:', error));
}




function showBookDetails(bookInfo) {
    console.log(bookInfo);
    const modal = document.getElementById('bookModal');
    const bookImage = document.getElementById('book-image');
    const bookTitle = document.getElementById('book-title');
    const bookDescription = document.getElementById('book-description');
    const addToLibraryBtn = document.getElementById('addToLibraryBtn');
    const bookPriceInfo = document.getElementById('book-price-info');
    const isFree = bookInfo.saleInfo && bookInfo.saleInfo.saleability === 'FREE';
    const isForSale = bookInfo.saleInfo && bookInfo.saleInfo.saleability === 'FOR_SALE';
    const isNotForSale = bookInfo.saleInfo && bookInfo.saleInfo.saleability === 'NOT_FOR_SALE';
    const price = bookInfo.saleInfo && bookInfo.saleInfo.retailPrice ? `${bookInfo.saleInfo.retailPrice.amount} ${bookInfo.saleInfo.retailPrice.currencyCode}` : 'No disponible';

    // Actualiza los detalles del libro en el modal
    bookTitle.textContent = bookInfo.title || 'Título no disponible';
    bookDescription.textContent = bookInfo.description || 'Descripción no disponible';
    bookImage.src = bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/200x300?text=Sin+imagen';

    // Muestra si el libro es gratuito o su precio
    if (isFree) {
        bookPriceInfo.textContent = "Este libro es gratuito";
        bookPriceInfo.style.color = "green";
    } else if (isForSale) {
        bookPriceInfo.textContent = `Precio: ${price}`;
        bookPriceInfo.style.color = "red";
    } else if (isNotForSale) {
        bookPriceInfo.textContent = "Este libro es gratuito";
        bookPriceInfo.style.color = "green";
    }
    
    // Configurar el evento onclick del botón para permitir añadir el libro si es gratuito o no está a la venta
    addToLibraryBtn.onclick = () => {
        if (isFree || isNotForSale) {  // Permitir agregar si el libro es gratuito o no está a la venta
            addToLibrary(bookInfo);
            closeModal();  // Cerrar el modal después de añadir el libro
        } else {
            alert('Este libro es de pago y no puede ser añadido a tu biblioteca.');  // Mensaje para libros de pago
        }
    };

    modal.style.display = 'block'; // Mostrar el modal
}

// Función para obtener las primeras N palabras de una descripción
function getShortDescription(description, maxWords) {
    const words = description.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return description;
}

function addToLibrary(book) {
    console.log(book);
    // Recuperar la biblioteca existente de localStorage o iniciar una nueva si no existe
    const libraryBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];

    if (!book.title) {
        alert('El libro debe tener un título para ser añadido a la biblioteca.');
        return; // Salir de la función si el libro no tiene título
    }
    // Comprobar si el libro ya está en la biblioteca basado en un identificador único, como podría ser el título
    if (libraryBooks.some(libBook => libBook.title === book.title)) {
        alert('Este libro ya está en tu biblioteca.'); // O alguna otra forma de notificación
        return; // Salir de la función si el libro ya existe
    }

    // Crear un nuevo objeto de libro con información completa
    const newBook = {
        title: book.title,
        author: book.authors?.join(', ') || 'Autor no disponible', // Unir autores con coma o mostrar un mensaje si no están disponibles
        image: book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=Sin+imagen', // Imagen del libro o una imagen de placeholder
        link: book.infoLink || '#' // Enlace para más información o un enlace placeholder
    };

    // Añadir el nuevo libro a la biblioteca
    libraryBooks.push(newBook);

    // Guardar la biblioteca actualizada en localStorage
    localStorage.setItem('libraryBooks', JSON.stringify(libraryBooks));

    // Notificar al usuario que el libro fue añadido exitosamente
    alert('Libro añadido a tu biblioteca.');
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
