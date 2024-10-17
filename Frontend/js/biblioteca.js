document.addEventListener("DOMContentLoaded", function() {
    const libraryContainer = document.getElementById('library');
    const storedBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];

    storedBooks.forEach(book => {
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

        libraryContainer.appendChild(bookElement);
    });
});

// Función para cerrar el modal
function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
}
