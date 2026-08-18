const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 4040;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("ShareBox File Sharing Platform is running!");
});

app.get("/health", (req, res) => {
    res.json({
        status: "UP",
        service: "ShareBox"
    });
});

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    res.json({
        message: "File uploaded successfully",
        filename: req.file.filename
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`ShareBox server running on port ${PORT}`);
});