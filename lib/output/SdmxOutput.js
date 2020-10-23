const { create } = require('xmlbuilder2')
const BaseOutput = require('./BaseOutput')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser

/**
 * Options:
 *
 * language: string
 *   Optionally specify a language to put into the "lang" attributes.
 */
class SdmxOutput extends BaseOutput {

    write(metadata, outputFile) {
        outputFile = this.getFilename(metadata, outputFile)

        const descriptors = metadata.getDescriptors()
        const concepts = metadata.getConcepts()
        const conceptIds = Object.keys(concepts)
        const language = this.getLanguage(descriptors)
        const reportingType = descriptors['REPORTING_TYPE']
        const refArea = descriptors['REF_AREA']
        const dataflowId = this.getDataflowId(descriptors)

        let serieses = descriptors['SERIES']
        if (!Array.isArray(serieses)) {
            serieses = [serieses]
        }

        const namespaces = {
            mes: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/message',
            com: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/common',
            gen: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/metadata/generic',
            str: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/structure',
        }

        const sdmxDsd = metadata.getValue('sdmx_dsd')
        let dsdVersion = '1.0'
        if (sdmxDsd) {
            const doc = new dom().parseFromString(sdmxDsd)
            const select = xpath.useNamespaces(namespaces)
            try {
                dsdVersion = select('//str:DataStructures/str:DataStructure', doc)[0].getAttribute('version')
            }
            catch (e) {
                metadata.addMessage('WARNING: Unable to get version of SDMX DSD. Assume 1.0.')
            }
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
                'mes:MetadataSet': serieses.map(series => {
                    return {
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
                                            'com:KeyValue@@com': [
                                                {
                                                    '@id': 'SERIES',
                                                    'com:Value': series
                                                },
                                                {
                                                    '@id': 'REPORTING_TYPE',
                                                    'com:Value': reportingType,
                                                },
                                                {
                                                    '@id': 'REF_AREA',
                                                    'com:Value': refArea,
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        '@id': 'Dataflow',
                                        'gen:ObjectReference': {
                                            'URN': 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=IAEG-SDGs:' + dataflowId + '(' + dsdVersion + ')'
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
                })
            }
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

    getFilenameExtension() {
        return 'xml'
    }
}

module.exports = SdmxOutput
