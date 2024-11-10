document.addEventListener("DOMContentLoaded", function() {
    const libraryContainer = document.getElementById('library');
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
                <h4 class="story-title">${book.title || 'Título Desconocido'}</h4>
                <p class="story-author">${book.author || 'Autor Desconocido'}</p>
                <a href="${book.link || '../html/lectura.html'}" class="cta-button">
                    <img src="../img/leer.png" alt="Icono de Leer" class="cta-image"> Leer
                </a>
            </div>
        `;

        return bookElement;
    }
});

//function clearLocalStorageOnReload() {
    //localStorage.clear(); // Limpia todos los datos del localStorage
//}

// Llama a la función cuando se carga la ventana
//window.onload = clearLocalStorageOnReload;
