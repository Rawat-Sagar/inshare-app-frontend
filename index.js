const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".browseBtn");
const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#progressPercent");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const status = document.querySelector(".status");
const fileURLInput = document.querySelector("#fileURL")
const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const toast = document.querySelector(".toast");
const host = "https://inshare-app-backend.herokuapp.com/";
const uploadURL = `${host}api/files`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb
dropZone.addEventListener("dragover", (e) => {
    console.log("dragging");
    e.preventDefault();
    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged");
    }

});

dropZone.addEventListener("dragleave", (e) => {
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    // uncomment to see drop dataTransfer.
    // console.log(e);
    const files = e.dataTransfer.files;
    console.log(files);
    if (files.length) {
        // for attachment of file.
        fileInput.files = files;
        uploadFile();
    }

});


fileInput.addEventListener("change", () => {
    if (fileInput.files[0].size > maxAllowedSize) {
        showToast("Max file size is 100MB");
        fileInput.value = ""; // reset the input
        return;
    }
    uploadFile();
});


browseBtn.addEventListener("click", () => {
    fileInput.click();
});

copyURLBtn.addEventListener("click", () => {
    fileURLInput.select()
    document.execCommand("copy");
    showToast("Link Copied");
})

const uploadFile = () => {
    // for only 1 file to be taken.
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("myfile", file);

    progressContainer.style.display = "block";
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        // console.log(xhr.readyState);
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgress;

    // handle error
    xhr.upload.onerror = function () {
        showToast(`Error in upload: ${xhr.status}.`);
        fileInput.value = ""; // reset the input
    };

    xhr.open("POST", uploadURL,true);
    xhr.setRequestHeader('X-PINGOTHER', 'pingpong');
    xhr.setRequestHeader('Content-Type', 'text/html');
    xhr.send(formData);
};

const updateProgress = (e) => {
    // to load the percentage uploaded.
    const percent = Math.round((e.loaded / e.total) * 100);
    console.log(percent);
    progressPercent.innerText = percent;
    const scaleX = `scaleX(${percent / 100})`;
    bgProgress.style.transform = scaleX;
    progressBar.style.transform = scaleX;
};

const showLink = ({ file: url }) => {
    console.log(url);
    progressContainer.style.display = "none";
    fileURLInput.value = url;
    sharingContainer.style.display = "block";
};

let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%,0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.transform = "translate(-50%,60px)";
    }, 2000);
}
