function showSection(section) {
    const sections = document.querySelectorAll('.section');
    sections.forEach((sec) => {
        sec.style.display = 'none';
    });
    document.getElementById(section).style.display = 'block';

    const links = document.querySelectorAll('.settings-menu a');
    links.forEach((link) => {
        link.classList.remove('active');
    });
    const activeLink = Array.from(links).find(link => link.textContent.toLowerCase() === section);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}
//MODAL DEL INFO
 // Variables para los elementos del DOM
 const modal = document.getElementById("myModal");
 const openModalBtn = document.getElementById("openModalBtn");
 const saveBtn = document.getElementById("saveBtn");
 const cancelBtn = document.getElementById("cancelBtn");
 const description = document.getElementById("description");

 // Mostrar el modal
 openModalBtn.onclick = function() {
     modal.style.display = "flex";
 }

 // Ocultar el modal al hacer clic en "Cancelar"
 cancelBtn.onclick = function() {
     modal.style.display = "none";
 }

 // Guardar la descripción y cerrar el modal
 saveBtn.onclick = function() {
     const descText = description.value;
     if (descText.trim()) {
         openModalBtn.textContent = descText; // Cambia el texto del botón a la descripción
     } else {
         alert("Por favor, escribe una descripción.");
     }
     modal.style.display = "none";
 }

 // Cerrar el modal si se hace clic fuera de él
 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
 }


 //CONVERSACION
 function toggleMenu() {
    const menu = document.getElementById("menu");
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  }
// MODAL DEL PERFIL 
// Selección de elementos
const editProfileBtn = document.getElementById('editProfileBtn'); // Botón para abrir el modal
const editProfileModal = document.getElementById('editProfileModal'); // Modal
const closeModal = document.querySelector('#editProfileModal .close'); // Botón de cerrar

// Abrir el modal
editProfileBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Evita que el enlace recargue la página
    editProfileModal.style.display = 'block'; // Muestra el modal
});

// Cerrar el modal al hacer clic en la "X"
closeModal.addEventListener('click', () => {
    editProfileModal.style.display = 'none'; // Oculta el modal
});

// Cerrar el modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === editProfileModal) {
        editProfileModal.style.display = 'none'; // Oculta el modal
    }
});
