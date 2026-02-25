const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Tesseract = require("tesseract.js");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
    res.send("Server is running successfully 🚀");
});

app.get("/test", (req, res) => {
    console.log("Test route hit");
    res.json({ message: "Backend working" });
});

app.post("/scan-aadhar", upload.single("image"), async (req, res) => {
    try {
        const imagePath = req.file.path;

        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            "eng"
        );

        fs.unlinkSync(imagePath); // delete image after OCR

        const parsed = parseAadhar(text);

        res.json(parsed);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "OCR failed" });
    }
});

function parseAadhar(text) {
  console.log("OCR TEXT START ----------");
  console.log(text);
  console.log("OCR TEXT END ------------");

  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const dobMatch = text.match(/\d{2}[\s\/\-]\d{2}[\s\/\-]\d{4}/);
  const genderMatch = text.match(/MALE|FEMALE/i);

  let name = "";

  for (let line of lines) {
    if (
      line.length > 3 &&
      !line.match(/\d/) &&
      !line.toLowerCase().includes("government") &&
      !line.toLowerCase().includes("india") &&
      line === line.toUpperCase()
    ) {
      name = line;
      break;
    }
  }

  return {
    name: name || "",
    dob: dobMatch ? dobMatch[0] : "",
    gender: genderMatch ? genderMatch[0] : "",
    father: "",
    address: ""
  };
}

app.listen(5000, () => {
    console.log("Server running on port 5000");
});