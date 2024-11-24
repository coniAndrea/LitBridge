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
    addToLibraryBtn.onclick = () => handleAddToLibrary(bookInfo, isForSale);

    modal.style.display = 'block';
}

// Función para manejar el proceso de agregar libros con validación
function handleAddToLibrary(bookInfo, isPurchasable) {
    if (isPurchasable) {
        showNotification('Este libro es de pago y no puede ser añadido a tu biblioteca.', 'error');
        return;
    }
    addToLibrary(bookInfo);
    closeModal();
}

// Función para obtener una descripción corta
function getShortDescription(description, maxWords) {
    const words = description.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : description;
}

// Agregar un libro a la biblioteca
function addToLibrary(book) {
    const libraryBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];

    if (libraryBooks.some(libBook => libBook.title === book.title)) {
        showNotification('Este libro ya está en tu biblioteca.', 'warning');
        return;
    }

    const newBook = {
        title: book.title,
        author: book.authors?.join(', ') || 'Autor no disponible',
        image: book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x195?text=Sin+imagen',
        link: book.infoLink || '#'
    };

    libraryBooks.push(newBook);
    localStorage.setItem('libraryBooks', JSON.stringify(libraryBooks));
    showNotification('Libro añadido a tu biblioteca.', 'success');
}

// Mostrar una notificación con colores mejorados
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';

    // Asignar colores según el tipo de mensaje
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4caf50'; // Verde
            notification.style.color = '#ffffff';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ff9800'; // Naranja
            notification.style.color = '#ffffff';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336'; // Rojo
            notification.style.color = '#ffffff';
            break;
        default:
            notification.style.backgroundColor = '#2196f3'; // Azul
            notification.style.color = '#ffffff';
            break;
    }



    document.body.appendChild(notification);

    // Elimina la notificación después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Cerrar el modal
function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// Asignar el evento para cerrar el modal
document.getElementById('closeModalBtn').onclick = closeModal;

// Llamadas para cargar libros en distintas secciones
fetchBooks('mystery', carouselBooks);
fetchBooks('fantasy', genreBooks);
// Agrega más categorías según sea necesario
