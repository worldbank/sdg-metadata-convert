const fs = require('fs')
const bent = require('bent')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser

const args = process.argv.slice(2)
if (args.length < 1) {
    console.log('Please indicate a URL for a DSD. Example: node dsd-refresh.js https://registry.sdmx.org/ws/public/sdmxapi/rest/datastructure/IAEG-SDGs/SDG/latest/?format=sdmx-2.1&detail=full&references=children')
    return
}
refreshFromDsd(args[0])

async function refreshFromDsd(source) {
    const getString = bent('string')
    xmlString = await getString(source)
    const doc = new dom().parseFromString(xmlString)
    const namespaces = {
        mes: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/message',
        str: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/structure',
        com: 'http://www.sdmx.org/resources/sdmxml/schemas/v2_1/common',
    }
    const select = xpath.useNamespaces(namespaces)

    const seriesOptions = []
    for (const code of select('.//str:Codelist[@id="CL_SERIES"]/str:Code', doc)) {
        const seriesId = code.getAttribute('id')
        const seriesName = select('./com:Name', code)[0].firstChild.nodeValue
        let indicatorId = null
        for (const annotation of select('./com:Annotations/com:Annotation', code)) {
            const annotationTitleNode = select('./com:AnnotationTitle', annotation)
            const annotationTextNode = select('./com:AnnotationText', annotation)
            if (annotationTitleNode.length == 0 || annotationTextNode.length == 0) {
                continue
            }
            const annotationTitle = annotationTitleNode[0].firstChild.nodeValue
            const annotationText = annotationTextNode[0].firstChild.nodeValue
            if (annotationTitle == 'Indicator') {
                indicatorId = annotationText
            }
        }
        seriesOptions.push({
            key: seriesId,
            value: seriesName,
            indicatorId: indicatorId,
        })
    }

    const areaOptions = []
    for (const code of select('.//str:Codelist[@id="CL_AREA"]/str:Code', doc)) {
        const areaId = code.getAttribute('id')
        if (isNaN(areaId)) {
            continue
        }
        const areaName = select('./com:Name', code)[0].firstChild.nodeValue
        areaOptions.push({
            key: areaId,
            value: areaName,
        })
    }

    const descriptorPath = './lib/store/descriptors.json'
    const descriptorData = fs.readFileSync(descriptorPath)
    const descriptors = JSON.parse(descriptorData)
    descriptors.forEach(descriptor => {
        if (descriptor.id === 'SERIES') {
            descriptor.options = seriesOptions
        }
        if (descriptor.id === 'REF_AREA') {
            descriptor.options = areaOptions
        }
    })

    const refreshed = JSON.stringify(descriptors, null, 4);
    fs.writeFileSync(descriptorPath, refreshed);
}
