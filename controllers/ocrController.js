const Tesseract = require('tesseract.js');
const isbnUtils = require('isbn-utils');

exports.extractISBN = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }

    try {
        // Perform OCR on the uploaded image
        const { data } = await Tesseract.recognize(req.file.path, 'eng', {
            logger: (m) => console.log(m), // Logs OCR processing steps
        });

        console.log("Extracted OCR Text:", data.text);
        res.send(data.text);

        // Extract possible ISBNs from the text
        const isbnMatches = data.text.match(/\b\d{9}[\dX]|\b\d{13}\b/g);

        if (!isbnMatches) {
            return res.status(404).json({ error: "No valid ISBN found in extracted text" });
        }

        // Validate and return the first valid ISBN
        for (const isbn of isbnMatches) {
            const formattedISBN = isbnUtils.asIsbn13(isbn); // Convert to ISBN-13
            if (formattedISBN) {
                return res.status(200).json({ extractedISBN: formattedISBN });
            }
        }

        return res.status(404).json({ error: "No valid ISBN found" });

    } catch (error) {
        return res.status(500).json({ error: "OCR processing failed", details: error.message });
    }
};
