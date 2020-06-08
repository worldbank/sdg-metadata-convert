const InputError = require('../InputError')

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

    handleInputError(error) {
        if (error instanceof InputError) {
            return error
        }
        throw error
    }
}

module.exports = BaseInput
