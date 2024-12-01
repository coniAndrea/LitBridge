function toggleMenu() {
    const menu = document.getElementById('userMenu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// Cerrar el menú al hacer clic fuera de él
window.onclick = function(event) {
    const menu = document.getElementById('userMenu');
    if (!event.target.matches('.user-icon') && menu.style.display === 'block') {
        menu.style.display = 'none';
    }
}

function toggleMenu() {
    const menu = document.getElementById('userMenu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// Cerrar el menú al hacer clic fuera de él
window.onclick = function(event) {
    const menu = document.getElementById('userMenu');
    if (!event.target.matches('.user-icon') && menu.style.display === 'block') {
        menu.style.display = 'none';
    }
}

// Función para contar palabras
function updateWordCount(editor) {
    const wordCount = editor.plugins.wordcount.getCount();
    document.getElementById('wordCount').textContent = `Palabras: ${wordCount}`;
}
