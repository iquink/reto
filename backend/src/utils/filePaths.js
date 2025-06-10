const extractFilePaths = (files) => {
  if (Array.isArray(files)) {
    return files.map(file => file.filename); // Only filename
  }
  return files ? files.filename : undefined;
};

module.exports = {
  extractFilePaths
};