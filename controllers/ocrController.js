const Tesseract = require('tesseract.js');
const fs = require('fs');
const { isValidISBN } = require('../utils/isbnValidator');

exports.extractISBN = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;

    // Use Tesseract to perform OCR on the image
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: (m) => console.log(m),
    });

    // Delete the uploaded image after processing
    fs.unlinkSync(imagePath);

    // Regular expression to find potential ISBN numbers (ISBN-10 or ISBN-13)
    const isbnRegex = /(?:ISBN(?:-1[03])?:?\s*)?((?:97[89])?\d{9}[\dX])/gi;
    const matches = text.match(isbnRegex);

    if (matches) {
      // Validate each matched string until a valid ISBN is found
      for (let match of matches) {
        // Clean up the match: remove non-digit characters (except 'X')
        const potentialISBN = match.replace(/[^0-9X]/gi, '');
        if (isValidISBN(potentialISBN)) {
          return res.json({ isbn: potentialISBN });
        }
      }
    }

    return res.status(404).json({ error: 'No valid ISBN found' });
  } catch (error) {
    console.error('Error extracting ISBN:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
