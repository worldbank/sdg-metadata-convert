/**
 * Options:
 *
 * debug: boolean
 *   Used in subclasses to decide whether to output errors/warnings.
 */
class BaseInput {
    constructor(options) {
        this.options = options || {}
    }
}

module.exports = BaseInput
