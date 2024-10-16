// Función para mostrar los libros en la biblioteca
function displayLibrary() {
    let library = JSON.parse(localStorage.getItem('library')) || [];
    let libraryContainer = document.getElementById('library');

    // Limpia el contenido anterior
    libraryContainer.innerHTML = '';

    library.forEach((book, index) => {
        // Crea el contenedor para cada libro
        let bookContainer = document.createElement('div');
        bookContainer.classList.add('book-container');

        // Contenido del libro
        bookContainer.innerHTML = `
            <img src="${book.image}" alt="Portada de ${book.title}">
            <div class="book-details">
                <h3>${book.title}</h3>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>Capítulos:</strong> ${book.chapters}</p>
            </div>
            <div class="book-actions">
                <button onclick="readBook(${index})">Leer</button>
            </div>
        `;

        // Añade el contenedor al div principal
        libraryContainer.appendChild(bookContainer);
    });
}

// Función que se ejecuta al hacer clic en "Leer"
function readBook(index) {
    // Aquí puedes redirigir al usuario a la página de lectura del libro
    alert('Vas a leer el libro ' + index);
}

// Llama a la función para mostrar los libros al cargar la página
displayLibrary();