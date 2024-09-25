function togglePassword() {
    var passwordFields = document.querySelectorAll("input[type='password']");
    passwordFields.forEach(function(passwordField) {
        var eyeIcon = passwordField.nextElementSibling.querySelector("i");
        if (passwordField.type === "password") {
            passwordField.type = "text";
            eyeIcon.classList.remove("fa-eye");
            eyeIcon.classList.add("fa-eye-slash");
        } else {
            passwordField.type = "password";
            eyeIcon.classList.remove("fa-eye-slash");
            eyeIcon.classList.add("fa-eye");
        }
    });
}