const restOfBody = document.getElementById("restOfBody");

const btnLogin = document.getElementById("btnLogin");
const formLogin = document.getElementById("formLogin");
const formLoginCont = document.getElementById("formLoginCont");

const sidebar = document.querySelector(".sidebar");
const header = document.querySelector(".header");

if (btnLogin) {
  btnLogin.addEventListener("click", (e) => {
    formLoginCont.classList.add("form__open");
    sidebar.style.zIndex = -1;
  });
}
if (formLoginCont) {
  formLoginCont.addEventListener("click", (e) => {
    if (e.target.classList.contains("form__open")) {
      e.target.classList.remove("form__open");
      sidebar.style.zIndex = 1;
    }
  });
}

const btnAddArt = document.getElementById("addArticle");
const addArtForm = document.getElementById("addArtForm");
const addArtFormCont = document.getElementById("addArtFormCont");

if (btnAddArt) {
  btnAddArt.addEventListener("click", (e) => {
    addArtFormCont.classList.add("form__open");
    sidebar.style.zIndex = -1;
    header.style.zIndex = -1;
  });
}

if (addArtFormCont) {
  addArtFormCont.addEventListener("click", (e) => {
    if (e.target.classList.contains("form__open")) {
      e.target.classList.remove("form__open");
      sidebar.style.zIndex = 1;
      header.style.zIndex = "auto";
    }
  });
}

const body = document.querySelector("body");
body.addEventListener("click", (e) => {
  console.log(e.target);
});
