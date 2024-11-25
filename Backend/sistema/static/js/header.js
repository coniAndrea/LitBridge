document.addEventListener('DOMContentLoaded', function() {
    // Referencia al elemento header
    const header = document.querySelector('header'); // Asegúrate de que este selector coincida con tu HTML

    // Función para manejar el hover de las listas desplegables de categorías
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = dropdown.querySelector('.dropdown-content');

    // Mostrar el contenido del dropdown cuando el mouse está encima
    dropdown.addEventListener('mouseenter', function() {
        dropdownContent.style.display = 'flex';
    });

    // Ocultar el contenido del dropdown cuando el mouse sale de él
    dropdown.addEventListener('mouseleave', function() {
        dropdownContent.style.display = 'none';
    });

    // Función para manejar el hover del menú de usuario
    const userContainer = document.querySelector('.user-container');
    const userMenu = document.getElementById('userMenu');

    // Mostrar el menú de usuario cuando el mouse está encima del contenedor de usuario
    userContainer.addEventListener('mouseenter', function() {
        userMenu.style.display = 'block';
    });

    // Ocultar el menú de usuario cuando el mouse sale de él
    userContainer.addEventListener('mouseleave', function() {
        userMenu.style.display = 'none';
    });

    // Función para cerrar el menú de usuario si se hace clic fuera del área del header
    document.addEventListener('click', function(event) {
        const isClickInsideHeader = header.contains(event.target); // header ahora está definido
        const isClickInsideUserMenu = userMenu.contains(event.target);
        const isClickInsideDropdown = dropdown.contains(event.target);

        // Verificar si el clic fue fuera de todos los elementos
        if (!isClickInsideHeader && !isClickInsideUserMenu && !isClickInsideDropdown) {
            // Ocultar los menús si el clic es fuera del header
            userMenu.style.display = 'none';
            dropdownContent.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del DOM
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = dropdown.querySelector('.dropdown-content');

    // Comprobamos el estado del dropdown en el localStorage
    const isDropdownOpen = localStorage.getItem('dropdownOpen') === 'true';

    // Si el estado es "abierto", mostramos el menú al cargar
    if (isDropdownOpen) {
        dropdownContent.style.display = 'flex';
    }

    // Añadimos un evento al botón de la categoría para alternar el estado
    dropdown.addEventListener('click', function() {
        const isOpen = dropdownContent.style.display === 'flex';

        // Alternamos el estado del dropdown
        if (isOpen) {
            dropdownContent.style.display = 'none';
            localStorage.setItem('dropdownOpen', 'false'); // Guardamos que está cerrado
        } else {
            dropdownContent.style.display = 'flex';
            localStorage.setItem('dropdownOpen', 'true'); // Guardamos que está abierto
        }
    });
});