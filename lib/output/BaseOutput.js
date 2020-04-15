class BaseOutput {
    constructor(target, options) {
        this.options = options || {}
    }

    write(metadata, outputFile) {
        throw 'write() must be implemented.'
    }

}

module.exports = BaseOutput
