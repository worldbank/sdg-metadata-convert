class baseOutput {
    constructor(target, options) {
        this.target = target
        this.options = options || {}
    }

    execute() {
        throw 'execute not implemented.'
    }

}

module.exports = baseOutput
