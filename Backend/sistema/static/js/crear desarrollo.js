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
 
// para utilizar api tinyMCE--> Api con la cual se puede crear algo paracido a word 
tinymce.init({
    selector: '#editor',
    menubar: false,
    toolbar: 'undo redo | formatselect | bold italic underline | fontsizeselect forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | removeformat',
    plugins: 'wordcount',
    setup: function (editor) {
        editor.on('input', function () {
            updateWordCount(editor);
        });
    }
});

// Función para contar palabras
function updateWordCount(editor) {
    const wordCount = editor.plugins.wordcount.getCount();
    document.getElementById('wordCount').textContent = `Palabras: ${wordCount}`;
}
