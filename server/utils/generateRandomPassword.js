const crypto = require('crypto');


// Function to generate a random temporary password
const generateRandomPassword = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = generateRandomPassword;