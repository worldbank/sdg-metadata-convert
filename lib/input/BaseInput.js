class BaseInput {
    constructor(source, options) {
        this.source = source
        this.options = options || {}
        this.metadata = {}
    }

    // Public method for performing a conversion.
    convertTo(outputs) {
        if (!Array.isArray(outputs)) {
            outputs = [outputs]
        }
        for (const output of outputs) {
            this.cached ? output.execute(this.metadata) : this._convert(output)
        }
    }

    // All inputs must implement a _convert() method, which takes an output.
    _convert(output) {
        throw '_convert not implemented.'
    }

    // The required _convert() must take an output which it eventually passes
    // to this _to() method.
    _to(output) {
        this.cached = true
        output.execute(this.metadata)
    }

    // All inputs must use this _setConcept() method as it inputs metadata.
    _setConcept(conceptId, conceptValue) {
        this.metadata[conceptId] = conceptValue
    }
}

module.exports = BaseInput