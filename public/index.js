/**
 * @type {null|{"meta":{"created":string},"quillList":[{"contentType":string,"content":string,"created":string,"modified":string,"id":string}]}}
 */
let DATA = null;
let currentID = "";

const createButton = document.querySelector("#createButton");
const loadButton = document.querySelector("#loadButton");
const dialog = document.querySelector("dialog");
const quillTextarea = document.querySelector("#quillTextarea");
const discardQuill = document.querySelector("#discardQuill");
const saveQuill = document.querySelector("#saveQuill");
const quillList = document.querySelector("#quillList");
const searchQuill = document.querySelector("#searchQuill");
const downloadQuill = document.querySelector("#downloadQuill");
const deleteQuill = document.querySelector("#deleteQuill");

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
  deleteQuill.classList.add("hidden");
  dialog.showModal();
});

function autoIncreaseHeight(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = Math.min(textarea.scrollHeight, parseInt(window.getComputedStyle(textarea).maxHeight)) + "px";
}

quillTextarea.oninput = () => {
  autoIncreaseHeight(quillTextarea);
}

deleteQuill.addEventListener("click", (_) => {
  DATA.quillList.splice(DATA.quillList.findIndex(quill => quill.id === currentID), 1);
  currentID = "";
  dialog.close();
  constructQuillList();
})

discardQuill.addEventListener("click", (_) => {
  currentID = "";
  deleteQuill.classList.remove("hidden");
  dialog.close();
});

saveQuill.addEventListener("click", (_) => {
  const text = quillTextarea.value
  quillTextarea.value = "";
  let quillFound = false;
  DATA.quillList.forEach((quill) => {
    if (quill.id === currentID) {
      quillFound = true;
      quill.modified = new Date().toISOString(),
        quill.content = text
    }
  });
  if (quillFound === false) {
    DATA.quillList.push({
      "contentType": "text/plain",
      "content": text,
      "created": new Date().toISOString(),
      "modified": new Date().toISOString(),
      "id": crypto.randomUUID().replaceAll("-", "")
    });
  }
  constructQuillList();
  currentID = "";
  deleteQuill.classList.remove("hidden");
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
      quillDiv.onclick = () => {
        quillTextarea.value = quill.content;
        currentID = quill.id;
        dialog.showModal();
      }
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
  DATA.quillList.forEach((quill) => {
    switch (quill.contentType) {
      case "text/plain":
        quill.content = btoa(quill.content);
    }
  });
  downloadString(JSON.stringify(DATA), "text/plain", new Date().getTime() + ".quill.json");
  DATA.quillList.forEach((quill) => {
    switch (quill.contentType) {
      case "text/plain":
        quill.content = atob(quill.content);
    }
  });
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
          DATA = JSON.parse(reader.result);
          DATA.quillList.forEach((quill) => {
            switch (quill.contentType) {
              case "text/plain":
                quill.content = atob(quill.content);
            }
          });
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


