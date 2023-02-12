const multer = require('multer')
const DataUri = new require('datauri/parser')
const dUri = new DataUri()
const path = require('path')
const storage = multer.memoryStorage()
const dataUri = file => {
    return dUri.format(path.extname(file.originalname).toString(),
        file.buffer);
}
module.exports = {
    multer: multer({ storage: storage }), dataUri
}