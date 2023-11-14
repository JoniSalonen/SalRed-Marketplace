const fs = require('fs');
const path = require('path');


function deleteFile(file) {
    fs.unlink(path.join(__dirname, '../view/media', file), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
    deleteFile: deleteFile,
}