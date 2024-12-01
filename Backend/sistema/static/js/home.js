const API_KEY = 'AIzaSyCF7kNw4UhcY_oKBZK-Fy-T4HnagUP7RJ8';

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
                const bookData = {
                    title: item.volumeInfo.title,
                    authors: item.volumeInfo.authors,
                    imageLinks: item.volumeInfo.imageLinks,
                    infoLink: item.volumeInfo.infoLink,
                    description: item.volumeInfo.description || 'Descripción no disponible',
                    saleInfo: item.saleInfo
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

// Mostrar los detalles del libro en un modal
function showBookDetails(bookInfo) {
    const modal = document.getElementById('bookModal');
    const bookImage = document.getElementById('book-image');
    const bookTitle = document.getElementById('book-title');
    const bookDescription = document.getElementById('book-description');
    const addToLibraryBtn = document.getElementById('addToLibraryBtn');
    const bookPriceInfo = document.getElementById('book-price-info');
    
    const isFree = bookInfo.saleInfo && bookInfo.saleInfo.saleability === 'FREE';
    const isForSale = bookInfo.saleInfo && bookInfo.saleInfo.saleability === 'FOR_SALE';
    const isNotForSale = bookInfo.saleInfo && bookInfo.saleInfo.saleability === 'NOT_FOR_SALE';
    const price = bookInfo.saleInfo?.retailPrice ? `${bookInfo.saleInfo.retailPrice.amount} ${bookInfo.saleInfo.retailPrice.currencyCode}` : 'No disponible';

    // Actualizar detalles del libro
    bookTitle.textContent = bookInfo.title || 'Título no disponible';
    bookDescription.textContent = getShortDescription(bookInfo.description, 150);
    bookImage.src = bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/200x300?text=Sin+imagen';

    if (isFree) {
        bookPriceInfo.textContent = "Este libro es gratuito";
        bookPriceInfo.style.color = "green";
    } else if (isForSale) {
        bookPriceInfo.textContent = `Precio: ${price}`;
        bookPriceInfo.style.color = "red";
    } else if (isNotForSale) {
        bookPriceInfo.textContent = "Este libro no está a la venta";
        bookPriceInfo.style.color = "orange";
    }

    // Configurar el botón de agregar a la biblioteca
    addToLibraryBtn.onclick = () => {
        if (isFree || isNotForSale) {
            addToLibrary(bookInfo);
            closeModal();
        } else {
            alert('Este libro es de pago y no puede ser añadido a tu biblioteca.');
        }
    };

    modal.style.display = 'block';
}

// Función para obtener una descripción corta
function getShortDescription(description, maxWords) {
    const words = description.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : description;
}

// Agregar un libro a la biblioteca
function addToLibrary(book) {
    // Obtener la biblioteca desde localStorage
    const library = JSON.parse(localStorage.getItem('library')) || [];

    // Evitar duplicados en la biblioteca
    const isDuplicate = library.some(item => item.id === book.id);
    if (!isDuplicate) {
        library.push({
            id: book.id,
            title: book.title,
            authors: book.authors,
            description: book.description,
            image: book.imageLinks?.thumbnail || '../img/default-cover.png'
        });
        localStorage.setItem('library', JSON.stringify(library));
        alert('Libro agregado a tu biblioteca');
    } else {
        alert('El libro ya está en tu biblioteca');
    }
}

// Cerrar el modal
// Función para cerrar el modal al hacer clic en el botón de cerrar
function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
    console.log('Modal cerrado'); // Mensaje para verificar que la función se ejecuta
}

// Asignar el evento para cerrar el modal
document.getElementById('closeModalBtn').onclick = closeModal;

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
// Función para mostrar una notificación de mensaje
function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.backgroundColor = color; // Asigna color según el mensaje
    document.body.appendChild(notification);

    // Elimina la notificación después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para agregar un libro a la biblioteca con notificación
function addToLibrary(book) {
    const libraryBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
    
    // Evitar duplicados en la biblioteca
    if (libraryBooks.some(libBook => libBook.title === book.title)) {
        showNotification('Este libro ya está en tu biblioteca.', 'orange');
        return;
    }

    const newBook = {
        id: book.id,
        title: book.title,
        author: book.authors?.join(', ') || 'Autor no disponible',
        description: book.description || 'Descripción no disponible', // Incluir la descripción
        image: book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=Sin+imagen',
        link: book.infoLink || '#'
    };

    libraryBooks.push(newBook);
    localStorage.setItem('libraryBooks', JSON.stringify(libraryBooks));
    showNotification('Libro añadido a tu biblioteca.', 'green');
}
// Función para mover el carrusel principal (Recomendaciones)
function moveCarousel(direction) {
    const carousel = document.getElementById('carousel-books');
    const scrollAmount = 300; // Ajusta el valor según el ancho de los libros

    // Mueve el carrusel en la dirección indicada
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Función para mover los carruseles de género
function moveCarouselGenre(direction, containerId) {
    const carousel = document.getElementById(containerId);
    const scrollAmount = 300; // Ajusta el valor según el ancho de los libros

    // Mueve el carrusel en la dirección indicada
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}


