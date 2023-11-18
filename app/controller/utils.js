const fs = require('fs');
const path = require('path');


//This function was provided by ChatGPT
function deleteFile(file) {
    fs.unlink(path.join(__dirname, '../view/media', file), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

function filename(file){
    parts = file.split('/');
    return parts[parts.length - 1];

}

module.exports = {
    deleteFile: deleteFile,
    filename: filename,
}