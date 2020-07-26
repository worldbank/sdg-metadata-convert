const BaseInput = require('./BaseInput')
const fs = require('fs')
const gettextParser = require('gettext-parser')
const conceptStore = require('../store/concept-store')
const descriptorStore = require('../store/descriptor-store')
const Metadata = require('../Metadata')

/**
 * Options:
 *
 * sourceStrings: boolean
 *   Optionally specify that we only want the source strings ("msgid") instead
 *   of the translated strings ("msgstr").
 */
class GettextInput extends BaseInput {

    read(source) {
        return fs.promises.readFile(source, { encoding: 'utf-8' }).then(data => this.parse(data))
    }

    readSync(source) {
        const data = fs.readFileSync(source, { encoding: 'utf-8' })
        return this.parse(data)
    }

    parse(data) {
        const concepts = this.defaultConcepts()
        const descriptors = this.defaultDescriptors()
        const parsed = gettextParser.po.parse(data)
        delete parsed.translations['']

        for (const id of Object.keys(parsed.translations)) {
            const source = Object.keys(parsed.translations[id])[0]
            const item = parsed.translations[id][source]
            const value = (this.options.sourceStrings) ? item.msgid : item.msgstr[0]
            if (conceptStore.isConcept(id)) {
                concepts[id] = value
            }
            if (descriptorStore.isDescriptor(id)) {
                descriptors[id] = value
            }
        }

        return new Metadata(concepts, descriptors)
    }
}

module.exports = GettextInput
