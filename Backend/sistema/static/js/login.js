function togglePassword() {
    var passwordField = document.getElementById("password");
    var eyeIcon = document.getElementById("toggle-eye");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}

function openModal() {
    document.getElementById("forgot-password-modal").style.display = "block";
}

function closeModal() {
    document.getElementById("forgot-password-modal").style.display = "none";
}

// Cerrar el modal si se hace clic fuera del contenido del modal
window.onclick = function(event) {
    const modal = document.getElementById("forgot-password-modal");
    if (event.target === modal) {
        closeModal();
    }
};