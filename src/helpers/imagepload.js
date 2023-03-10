const multer = require('multer')
const DataUri = new require('datauri/parser')
const dUri = new DataUri()
const path = require('path')
const storage = multer.memoryStorage()
const dataUri = file => {
    return dUri.format(path.extname(file?.originalname).toString(),
        file.buffer);
}
module.exports = {
    multer: multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            console.log(file.mimetype);
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true)
            } else {
                return cb(new Error('Wrong file type'))
            }
        }
    }), dataUri
}