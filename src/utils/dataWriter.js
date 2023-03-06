const fs = require("fs");
const logger = require("./logger");

const writeFile = (file, data) => {
  fs.writeFile(file, data, (err) => {
    if (err) {
      logger.error("Something went wrong =(");
    }
  });
};

module.exports = {
  writeFile,
};
