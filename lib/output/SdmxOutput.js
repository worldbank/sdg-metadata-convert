const { create } = require('xmlbuilder2')
const BaseOutput = require('./BaseOutput')

/**
 * Options:
 *
 * language: string
 *   Optionally specify a language to put into the "lang" attributes.
 */
class SdmxOutput extends BaseOutput {

    write(metadata, outputFile) {

        const descriptors = metadata.getDescriptors()
        const targetDescriptorIds = Object.keys(descriptors).filter(id => id !== 'LANGUAGE')
        const concepts = metadata.getConcepts()
        const conceptIds = Object.keys(concepts)
        const language = this.getLanguage(descriptors)
        const dataflowId = this.getDataflowId(descriptors)

        const namespaces = {
            mes: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/message',
            com: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/common',
            gen: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/metadata/generic',
        }

        const obj = {
            'mes:GenericMetadata': {
                '@xmlns:mes': namespaces.mes,
                '@xmlns:gen': namespaces.gen,
                '@xmlns:com': namespaces.com,
                'mes:Header': {
                    'mes:ID': this.generateMessageId(),
                    'mes:Test': 'false',
                    'mes:Prepared': new Date().toISOString(),
                    'mes:Sender': { '@id': 'sender' },
                    'mes:Structure': {
                        '@structureID': 'MDS1',
                        'com:Structure@@com': {
                            'URN': 'urn:sdmx:org.sdmx.infomodel.metadatastructure.MetadataStructure=IAEG-SDGs:SDG_MSD(0.3)',
                        }
                    }
                },
                'mes:MetadataSet': {
                    '@structureRef': 'MDS1',
                    '@setID': this.generateSetId(),
                    'com:Name@@com': {
                        '@xml:lang': language,
                        '#': 'SDG METADATA SET',
                    },
                    'gen:Report@@gen': {
                        '@id': 'SDG_META_RPT',
                        'gen:Target': {
                            '@id': 'KEY_TARGET',
                            'gen:ReferenceValue': [
                                {
                                    '@id': 'DIMENSION_DESCRIPTOR_VALUES_TARGET',
                                    'gen:DataKey': {
                                        'com:KeyValue@@com': targetDescriptorIds.map(id => {
                                            return {
                                                '@id': id,
                                                'com:Value': descriptors[id],
                                            }
                                        })
                                    }
                                },
                                {
                                    '@id': 'Dataflow',
                                    'gen:ObjectReference': {
                                        'URN': 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=IAEG-SDGs:' + dataflowId + '(1.0)'
                                    }
                                }
                            ]
                        },
                        'gen:AttributeSet': {
                            'gen:ReportedAttribute': conceptIds.map(id => {
                                return {
                                    '@id': id,
                                    'com:Text@@com': {
                                        '@xml:lang': language,
                                        '$': concepts[id],
                                    }
                                }
                            })
                        }
                    },
                }
            },
        }

        const doc = create({ namespaceAlias: namespaces }).ele(obj).dec({ 'encoding': 'utf-8'})
        const xml = doc.end({ prettyPrint: true })
        return this.writeFile(outputFile, xml, metadata)
    }

    generateMessageId() {
        // @TODO: Decide on requirements for this id.
        return 'MESSAGE_ID_PLACEHOLDER'
    }

    generateSetId() {
        // @TODO: Decide on requirements for this id.
        return 'SET_ID_PLACEHOLDER'
    }

    getDataflowId(descriptors) {
        return descriptors['REPORTING_TYPE'] === 'G' ? 'DF_SDG_GLH' : 'DF_SDG_GLC'
    }

    getLanguage(descriptors) {
        if (descriptors['LANGUAGE']) {
            return descriptors['LANGUAGE']
        }
        else {
            return this.options.language ? this.options.language : 'en'
        }
    }
}

module.exports = SdmxOutput
