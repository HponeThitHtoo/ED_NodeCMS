const path = require('path');

let isEmpty = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true;
}

let uploadDir = path.join(__dirname, '../public/uploads/');

module.exports = { 
  isEmpty,
  uploadDir,
};