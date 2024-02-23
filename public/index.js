/**
 * @type {null|{"meta":{"created":string},"quillList":[{"contentType":string,"content":string,"created":string,"modified":string,"id":string}]}}
 */
let DATA = null;

const createButton = document.querySelector("#createButton");
const loadButton = document.querySelector("#loadButton");
const dialog = document.querySelector("dialog");


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
  dialog.open = true;
});
