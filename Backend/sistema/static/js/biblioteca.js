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

    // Función para crear el elemento HTML de un libro
    function createBookElement(book) {
        const bookElement = document.createElement('div');
        bookElement.classList.add('story-container');
        
        bookElement.innerHTML = `
            <img src="${book.image || '../img/default-cover.png'}" alt="Portada de la historia" class="story-cover">
            <div class="story-details">
                <h2 class="story-title">${book.title || 'Título Desconocido'}</h2>
                <p class="story-author">${book.author || 'Autor Desconocido'}</p>
                <a href="${book.link || '../html/lectura.html'}" class="cta-button">
                    <img src="${book.image || '../img/leer.png'}"  class="cta-image"> Leer
                </a>
            </div>
        `;

        // Agregar un manejador de eventos al botón para redirigir a 'lectura.html'
        const readButton = bookElement.querySelector('.cta-button');
        readButton.addEventListener('click', () => {
            // Guardar los datos del libro en localStorage
            const bookData = {
                id: book.id,
                title: book.title,
                author: book.author,
                image: book.image,
                link: book.link,
            };
            localStorage.setItem('currentBook', JSON.stringify(bookData));

            // Redirigir a la página de lectura
            window.location.href = '../html/lectura.html';
        });

        // Retornar el elemento creado
        return bookElement;
    }
});



//function clearLocalStorageOnReload() {
    //localStorage.clear(); // Limpia todos los datos del localStorage
//}

// Llama a la función cuando se carga la ventana
//window.onload = clearLocalStorageOnReload;