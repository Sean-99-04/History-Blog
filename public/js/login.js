const btnLogin = document.getElementById("btnLogin");
const formLogin = document.getElementById("formLogin");
const formLoginCont = document.getElementById("formLoginCont");

const sidebar = document.querySelector(".sidebar");
const header = document.querySelector(".header");

// LOGIN //
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
// END OF 'LOGIN' //
// ADD ARTICLE //
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
// END OF 'ADD ARTICLE' //

// DELETE ARTICLE //
const btnDeleteArticle = document.querySelectorAll(".deleteArticle");

if (btnDeleteArticle) {
  btnDeleteArticle.forEach((el) => {
    el.addEventListener("click", (e) => {
      if (confirm("Are you sure you want to delete this article?")) {
      } else {
        e.preventDefault();
      }
    });
  });
}
// END OF 'DELETE ARTICLE' //
//=========================//
// Beginning of
