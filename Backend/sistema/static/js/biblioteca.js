document.addEventListener("DOMContentLoaded", function() {
    const libraryContainer = document.getElementById('library');
    if (!libraryContainer) {
        console.error("El contenedor de la biblioteca no existe en el DOM.");
        return; // Salir si el contenedor no se encuentra
    }

    const storedBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];

    // Mostrar libros almacenados
    storedBooks.forEach(book => {
        const bookElement = createBookElement(book);
        libraryContainer.appendChild(bookElement);
    });

    // Función para agregar un libro
    function addBookToLibrary(book) {
        const storedBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
        const bookExists = storedBooks.some(storedBook => storedBook.title === book.title && storedBook.author === book.author);

        if (!bookExists) {
            storedBooks.push(book);
            localStorage.setItem('libraryBooks', JSON.stringify(storedBooks));
            console.log('Libro agregado a la biblioteca.');
        } else {
            console.log('El libro ya está en la biblioteca.');
        }
    }

    function createBookElement(book) {
        const bookElement = document.createElement('div');
        bookElement.classList.add('story-container');
    
        bookElement.innerHTML = `
            <img src="${book.image || '../img/default-cover.png'}" alt="Portada de la historia" class="story-cover">
            <div class="story-details">
                <h2 class="story-title">${book.title || 'Título Desconocido'}</h2>
                <p class="story-author">${book.authors || 'Autor Desconocido'}</p>
                <button class="cta-button leer-button">
                    <img src="${book.image || '../img/leer.png'}"  class="cta-image"> Leer
                </button>
            </div>
        `;
    
        // Configurar el botón Leer
        const readButton = bookElement.querySelector('.leer-button');
        readButton.addEventListener('click', () => {
            const url = new URL('lectura', window.location.href);
            url.searchParams.append('title', encodeURIComponent(book.title));
            url.searchParams.append('author', encodeURIComponent(book.authors));
            url.searchParams.append('description', encodeURIComponent(book.description || 'Descripción no disponible.'));
            url.searchParams.append('image', encodeURIComponent(book.image));
            window.location.href = url.toString();
        });
    
        return bookElement;
    }

});
