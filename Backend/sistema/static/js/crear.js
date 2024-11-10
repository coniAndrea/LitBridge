function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('visible');
}

// Cerrar el menú si se hace clic fuera de él
window.onclick = function(event) {
    if (!event.target.matches('.user-button')) {
        const dropdowns = document.getElementsByClassName("user-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('visible')) {
                openDropdown.classList.remove('visible');
            }
        }
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function() {
        const bookCover = document.getElementById('bookCover');
        bookCover.innerHTML = ''; // Limpia el texto de "Añadir Portada"
        bookCover.style.backgroundImage = `url(${reader.result})`;
        bookCover.style.backgroundSize = 'cover'; // Asegura que la imagen cubra todo el contenedor
        bookCover.style.backgroundPosition = 'center';
    };
    
    if (file) {
        reader.readAsDataURL(file);
    }
}
