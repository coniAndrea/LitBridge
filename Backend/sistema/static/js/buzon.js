function showTab(tabId) {
    // Oculta todos los contenidos
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('active');
    });

    // Desactiva todas las pestañas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Muestra el contenido seleccionado
    document.getElementById(tabId).classList.add('active');
    
    // Activa la pestaña correspondiente
    document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
}
