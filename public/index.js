/**
 * @type {null|{"meta":{"created":string},"quillList":[{"contentType":string,"content":string,"created":string,"modified":string,"id":string}]}}
 */
let DATA = null;

const createButton = document.querySelector("#createButton");
const loadButton = document.querySelector("#loadButton");
const dialog = document.querySelector("dialog");
const quillTextarea = document.querySelector("#quillTextarea");
const discardQuill = document.querySelector("#discardQuill");
const saveQuill = document.querySelector("#saveQuill");
const quillList = document.querySelector("#quillList");
const searchQuill = document.querySelector("#searchQuill");
const downloadQuill = document.querySelector("#downloadQuill");

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

saveQuill.addEventListener("click", (_) => {
  const text = quillTextarea.value
  quillTextarea.value = "";
  DATA.quillList.push({
    "contentType": "text/plain",
    "content": text,
    "created": new Date().toISOString(),
    "modified": new Date().toISOString(),
    "id": crypto.randomUUID().replace("-", "")
  });
  constructQuillList();
  dialog.close();
});

window.addEventListener("resize", (_) => {
  autoIncreaseHeight(quillTextarea);
});

function constructQuillList(query = "") {
  quillList.innerHTML = "";
  DATA.quillList.forEach((quill) => {
    if (quill.content.toUpperCase().includes(query.toUpperCase())) {
      const quillDiv = document.createElement("div");
      quillDiv.innerText = quill.content;
      quillList.appendChild(quillDiv);
    }
  });
}

searchQuill.oninput = () => {
  constructQuillList(searchQuill.value.toUpperCase());
}


downloadQuill.addEventListener("click", (_) => {
  function downloadString(text, fileType, fileName) {
    const blob = new Blob([text], { type: fileType });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(":");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
  }
  downloadString(JSON.stringify(DATA), "text/plain", new Date().getTime() + ".quill.json");
});

loadButton.addEventListener("click", (_) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = false;
  fileInput.onchange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.toLowerCase().endsWith(".quill.json")) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          DATA = JSON.parse(reader.result);;
          console.log(DATA);
          document.querySelector(".init").remove();
          document.querySelector("#app").classList.remove("hidden");
          constructQuillList();
        }, false);
        reader.readAsText(selectedFile);
      } else {
      }
    }
  };

  fileInput.click();
});
