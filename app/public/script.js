const uploadForm =
    document.getElementById("uploadForm");

const fileInput =
    document.getElementById("fileInput");

const message =
    document.getElementById("message");

const fileList =
    document.getElementById("fileList");


uploadForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const file = fileInput.files[0];

    if (!file) {
        message.textContent = "Please select a file";
        return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

        const response = await fetch(
            "/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        message.textContent = result.message;

        fileInput.value = "";

        loadFiles();

    } catch (error) {

        message.textContent =
            "Upload failed";

        console.error(error);
    }

});


async function loadFiles() {

    try {

        const response =
            await fetch("/files");

        const files =
            await response.json();

        fileList.innerHTML = "";

        files.forEach(file => {

            const li =
                document.createElement("li");

            li.innerHTML = `
                ${file}

                <a href="/download/${encodeURIComponent(file)}">
                    Download
                </a>

                <button onclick="deleteFile('${file}')">
                    Delete
                </button>
            `;

            fileList.appendChild(li);

        });

    } catch (error) {

        console.error(error);

    }

}


async function deleteFile(filename) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this file?"
        );

    if (!confirmed) {
        return;
    }

    try {

        await fetch(
            `/files/${encodeURIComponent(filename)}`,
            {
                method: "DELETE"
            }
        );

        loadFiles();

    } catch (error) {

        console.error(error);

    }

}


loadFiles();