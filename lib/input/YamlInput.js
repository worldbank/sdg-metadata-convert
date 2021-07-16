const GettextInput = require('./GettextInput')
const yaml = require('js-yaml')
const conceptStore = require('../store/concept-store')
const descriptorStore = require('../store/descriptor-store')
const Metadata = require('../Metadata')

class YamlInput extends GettextInput {

    parse(data) {
        const concepts = this.defaultConcepts()
        const descriptors = this.defaultDescriptors()
        const parsed = yaml.load(data)

        for (const key of Object.keys(parsed)) {
            const value = parsed[key]
            if (conceptStore.isConcept(key)) {
                concepts[key] = value
            }
            if (descriptorStore.isDescriptor(key)) {
                descriptors[key] = value
            }
        }

        return new Metadata(concepts, descriptors)
    }
}

module.exports = YamlInput
