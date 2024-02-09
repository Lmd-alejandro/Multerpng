const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = 4000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./assets/imgProfile/");
    },
    filename: function (req, file, cb) {
        cb(null, "imgProfile-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return cb(new Error("Solo se permiten archivos de imagen."));
        }
        cb(null, true);
    }
}).single("imgProfile");

app.use(express.static(__dirname)); 

// Ruta para cargar los archivos de la imagen
app.post("/user/profile", (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Se obtiene la ruta del archivo subido
        const filePath = req.file.path;

        // Guardo la info del usuario
        res.send(`http://localhost:${PORT}/assets/imgProfile/${req.file.filename}`);
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
