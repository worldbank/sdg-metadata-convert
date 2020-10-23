const BaseInput = require('./BaseInput')
const conceptStore = require('../store/concept-store')
const descriptorStore = require('../store/descriptor-store')
const Metadata = require('../Metadata')
const bent = require('bent')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser
const fsp = require('fs').promises

class SdmxInput extends BaseInput {

    async read(source) {

        let xmlString

        if (source.startsWith('http')) {
            const getString = bent('string')
            xmlString = await getString(source)
        }
        else {
            xmlString = await fsp.readFile(source, { encoding: 'utf-8' })
        }

        const concepts = this.defaultConcepts()
        const descriptors = this.defaultDescriptors()
        const messages = []

        const doc = new dom().parseFromString(xmlString)
        const namespaces = {
            mes: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/message',
            com: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/common',
            gen: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/metadata/generic',
        }
        const select = xpath.useNamespaces(namespaces)

        const descriptorIds = descriptorStore.getDescriptorIds().filter(id => id !== 'LANGUAGE')
        for (const descriptorId of descriptorIds) {
            try {
                const descriptorValue = select('.//gen:ReferenceValue/gen:DataKey/com:KeyValue[@id="' + descriptorId + '"]/com:Value', doc)
                descriptors[descriptorId] = descriptorValue[0].firstChild.nodeValue
            } catch (e) {
                messages.push(this.handleInputError(e))
            }
        }

        try {
            const language = select('.//mes:MetadataSet/com:Name', doc)[0].getAttribute('xml:lang')
            descriptors['LANGUAGE'] = language
        } catch (e) {
            messages.push(this.handleInputError(e))
        }

        const conceptIds = conceptStore.getConceptIds()
        for (const conceptId of conceptIds) {
            try {
                const conceptValue = select('.//gen:Report/gen:AttributeSet/gen:ReportedAttribute[@id="' + conceptId + '"]/com:Text', doc)
                if (conceptValue.length > 0 && conceptValue[0].firstChild) {
                    concepts[conceptId] = conceptValue[0].firstChild.nodeValue
                }
            } catch (e) {
                messages.push(this.handleInputError(e))
            }
        }

        return new Metadata(concepts, descriptors, messages)
    }
}

module.exports = SdmxInput
