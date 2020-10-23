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

    getFilename(metadata, outputFile) {
        if (typeof outputFile === 'string') {
            return outputFile
        }
        if (typeof outputFile === 'undefined') {
            return this.createFilename(metadata)
        }
        if (typeof outputFile === 'function') {
            return outputFile(metadata)
        }
        return 'output.' + this.getFilenameExtension()
    }

    createFilename(metadata) {
        let seriesText = metadata.getDescriptor('SERIES')
        if (Array.isArray(series)) {
            seriesText = seriesText[0]
        }
        const filenameParts = [
            metadata.getDescriptor('REPORTING_TYPE'),
            seriesText,
            metadata.getDescriptor('REF_AREA'),
        ]
        return filenameParts.join('-') + '.' + this.getFilenameExtension()
    }

    getFilenameExtension() {
        throw 'getFilenameExtension() must be implemented.'
    }
}

module.exports = BaseOutput
