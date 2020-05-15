const fsp = require('fs').promises;

class BaseOutput {
    constructor(options) {
        this.options = options || {}
    }

    write(metadata, outputFile) {
        throw 'write() must be implemented.'
    }

    writeFile(outputFile, fileData, metadata) {
        return fsp.writeFile(outputFile, fileData).then(() => {
            return metadata
        }).catch(err => {
            console.error(err);
        });
    }
}

module.exports = BaseOutput
