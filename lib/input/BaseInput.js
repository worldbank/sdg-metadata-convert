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
            return error.message
        }
        throw error
    }

    defaultConcepts() {
        return {}
    }

    defaultDescriptors() {
        return {
            LANGUAGE: 'en'
        }
    }
}

module.exports = BaseInput
