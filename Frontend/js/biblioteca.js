document.addEventListener("DOMContentLoaded", function() {
    const libraryContainer = document.getElementById('library');
    const storedBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];

    for (let i = 0; i < storedBooks.length; i += 2) {
        const row = document.createElement('div');
        row.classList.add('library-row'); // Nueva fila para contener dos libros

        // Primer libro
        const bookElement1 = createBookElement(storedBooks[i]);
        row.appendChild(bookElement1);

        // Segundo libro (si existe)
        if (storedBooks[i + 1]) {
            const bookElement2 = createBookElement(storedBooks[i + 1]);
            row.appendChild(bookElement2);
        }

        // Añadir la fila a la biblioteca
        libraryContainer.appendChild(row);
    }

    function createBookElement(book) {
        const bookElement = document.createElement('div');
        bookElement.classList.add('story-container');
        
        bookElement.innerHTML = `
            <img src="${book.image || '../img/default-cover.png'}" alt="Portada de la historia" class="story-cover">
            <div class="story-details">
                <h2 class="story-title">${book.title || 'Título Desconocido'}</h2>
                <p class="story-author">${book.author || 'Autor Desconocido'}</p>
                <a href="${book.link || '#'}" class="cta-button">
                    <img src="../img/leer.png" alt="Icono de Leer" class="cta-image"> Leer
                </a>
            </div>
        `;

        return bookElement;
    }
});
