const btnSignup = document.getElementById("signup");
const btnLogin = document.getElementById("login");
const formSignup = document.getElementById("signupForm");
const formLogin = document.getElementById("loginForm");
const formSignupContainer = document.getElementById("signupFormContainer");
const formLoginContainer = document.getElementById("loginFormContainer");
if (btnSignup) {
  btnSignup.addEventListener("click", (e) => {
    formSignupContainer.classList.add("my-form__open");
  });
}

if (formSignupContainer) {
  formSignupContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("my-form__open")) {
      e.target.classList.remove("my-form__open");
    }
  });
}

if (btnLogin) {
  btnLogin.addEventListener("click", (e) => {
    formLoginContainer.classList.add("my-form__open");
  });
}
if (formLoginContainer) {
  formLoginContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("my-form__open")) {
      e.target.classList.remove("my-form__open");
    }
  });
}
