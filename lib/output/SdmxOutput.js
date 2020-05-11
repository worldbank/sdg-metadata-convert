const { create } = require('xmlbuilder2')
const BaseOutput = require('./BaseOutput')
const fsp = require('fs').promises;

/**
 * Options:
 *
 * language: string
 *   Optionally specify a language to put into the "lang" attributes.
 */
class SdmxOutput extends BaseOutput {

    write(metadata, outputFile) {

        const descriptors = metadata.getDescriptors()
        const descriptorIds = Object.keys(descriptors)
        const concepts = metadata.getConcepts()
        const conceptIds = Object.keys(concepts)
        const language = this.options.language ? this.options.language : 'en'

        const obj = {
            'message:GenericMetadata': {
                '@xmlns:message': 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/message',
                '@xmlns:metadata': 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/metadata/generic',
                '@xmlns:common': 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/common',
                '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                '@xsi:schemaLocation': 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/message schemas/SDMXMessage.xsd',
                'message:Header': {
                    'message:ID': this.generateMessageId(),
                    'message:Test': false,
                    'message:Prepared': new Date().toISOString(),
                    'message:Sender': { '@id': 'sender' },
                    'message:Structure': {
                        '@structureID': 'STR1',
                        'common:Structure': {
                            'Ref': {
                                '@agencyID': 'IAEG-SDGs',
                                '@id': 'SDG_MSD',
                                '@version': '0.1',
                            }
                        }
                    }
                },
                'message:MetadataSet': {
                    '@structureRef': 'STR1',
                    '@setID': this.generateSetId(),
                    'common:Name': 'SDG METADATA SET',
                    'metadata:Report': {
                        '@id': 'SDG_META_RPT',
                        'metadata:Target': {
                            '@id': 'KEY_TARGET',
                            'metadata:ReferenceValue': [
                                {
                                    '@id': 'DIMENSION_DESCRIPTOR_VALUES_TARGET',
                                    'metadata:DataKey': {
                                        'common:KeyValue': descriptorIds.map(id => {
                                            return {
                                                '@id': id,
                                                'common:Value': descriptors[id],
                                            }
                                        })
                                    }
                                },
                                {
                                    '@id': 'DataStructure',
                                    'metadata:ObjectReference': {
                                        'URN': 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=IAEG-SDGs:SDG(1.0)'
                                    }
                                }
                            ]
                        },
                        'metadata:AttributeSet': {
                            'metadata:ReportedAttribute': conceptIds.map(id => {
                                return {
                                    'metadata:ReportedAttribute': {
                                        '@id': id,
                                        'common:Text': {
                                            '@xml:lang': language,
                                            '$': concepts[id],
                                        }
                                    }
                                }
                            })
                        }
                    },
                }
            },
        }

        const doc = create(obj).dec({ 'encoding': 'utf-8'})
        const xml = doc.end({ prettyPrint: true })
        return fsp.writeFile(outputFile, xml)
    }

    generateMessageId() {
        // @TODO: Decide on requirements for this id.
        return 'MESSAGE_ID_PLACEHOLDER'
    }

    generateSetId() {
        // @TODO: Decide on requirements for this id.
        return 'SET_ID_PLACEHOLDER'
    }
}

module.exports = SdmxOutput
