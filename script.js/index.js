function togglePassword() {
    const password = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (password.type === 'password') {
        password.type = 'text';
        eyeIcon.classList.add("fa-eye-slash");
        eyeIcon.classList.remove("fa-eye");
    }
    else {
        password.type = 'password';
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
};


const loginBtn = document.getElementById("signInBtn");

loginBtn.addEventListener("click", function () {

    const username = document.getElementById("username");
    const password = document.getElementById("password");

    username.classList.remove("error");
    password.classList.remove("error");

    if (username.value === "admin" && password.value === "admin123") {
        window.location.href = "all.html";

    } else {
        if (username.value !== "admin") {
            username.classList.add("error");
        }
        if (password.value !== "admin123") {
            password.classList.add("error");
        }
    }

});