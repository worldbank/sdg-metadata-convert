const InputError = require('../InputError')
const Diff = require('../Diff')

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

    async diff(newMetaSource, oldMeta) {
        const newMeta = await this.read(newMetaSource)
        return new Diff(oldMeta, newMeta)
    }
}

module.exports = BaseInput
