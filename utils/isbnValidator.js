function isValidISBN(isbn) {
  // Remove hyphens or spaces
  isbn = isbn.replace(/[-\s]/g, '');

  if (isbn.length === 10) {
      return validateISBN10(isbn);
  } else if (isbn.length === 13) {
      return validateISBN13(isbn);
  }
  return false;
}

function validateISBN10(isbn) {
  if (!/^\d{9}[\dXx]$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
      sum += (i + 1) * parseInt(isbn[i], 10);
  }
  let lastChar = isbn[9].toUpperCase() === 'X' ? 10 : parseInt(isbn[9], 10);
  sum += 10 * lastChar;
  return sum % 11 === 0;
}

function validateISBN13(isbn) {
  if (!/^\d{13}$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) {
      let digit = parseInt(isbn[i], 10);
      sum += i % 2 === 0 ? digit : digit * 3;
  }
  return sum % 10 === 0;
}

// ✅ Export after defining all functions
module.exports = { isValidISBN };
