/**
 * @type {null|{"meta":{"created":string},"quillList":[{"contentType":string,"content":string,"created":string,"modified":string,"id":string}]}}
 */
let DATA = null;

const createButton = document.querySelector("#createButton");
const loadButton = document.querySelector("#loadButton");
const dialog = document.querySelector("dialog");
const quillTextarea = document.querySelector("#quillTextarea");
const discardQuill = document.querySelector("#discardQuill");


createButton.addEventListener("click", (_) => {
  DATA = {
    "meta": {
      "created": new Date().toISOString()
    },
    "quillList": []
  }
  document.querySelector(".init").remove();
  document.querySelector("#app").classList.remove("hidden");
});

newQuill.addEventListener("click", (_) => {
  dialog.showModal();
});

function autoIncreaseHeight(textarea) {
  console.log(textarea);
  textarea.style.height = "auto";
  console.log(Math.min(textarea.scrollHeight, parseInt(window.getComputedStyle(textarea).maxHeight)));
  textarea.style.height = Math.min(textarea.scrollHeight, parseInt(window.getComputedStyle(textarea).maxHeight)) + "px";
}

quillTextarea.oninput = () => {
  autoIncreaseHeight(quillTextarea);
  console.log(true);
}

discardQuill.addEventListener("click", (_) => {
  dialog.close();
});
