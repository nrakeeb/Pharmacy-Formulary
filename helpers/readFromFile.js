const util = require('util');
const fs = require('fs');

const readFromFile = util.promisify(fs.readFile);

module.exports = readFromFile;