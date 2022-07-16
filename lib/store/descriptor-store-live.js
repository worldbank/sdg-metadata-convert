const fs = require('fs')
const bent = require('bent')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser

const DESCRIPTORS = require('./descriptors.json')
const InputError = require('../InputError')
// 2 hours in milliseconds.
const CACHE_TTL = 1000 * 60 * 60 * 2

let cached = false
let cachedTimestamp = null

async function cacheDescriptors() {
    const source = 'https://registry.sdmx.org/ws/public/sdmxapi/rest/datastructure/IAEG-SDGs/SDG/latest/?format=sdmx-2.1&detail=full&references=children'
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
        let indicatorIds = []
        for (const annotation of select('./com:Annotations/com:Annotation', code)) {
            const annotationTitleNode = select('./com:AnnotationTitle', annotation)
            const annotationTextNode = select('./com:AnnotationText', annotation)
            if (annotationTitleNode.length == 0 || annotationTextNode.length == 0) {
                continue
            }
            const annotationTitle = annotationTitleNode[0].firstChild.nodeValue
            const annotationText = annotationTextNode[0].firstChild.nodeValue
            if (annotationTitle == 'Indicator') {
                indicatorIds.push(annotationText)
            }
        }
        seriesOptions.push({
            key: seriesId,
            value: normalizeSeriesName(seriesName),
            // For backwards compatibility, supply the first indicator id.
            indicatorId: indicatorIds[0],
            indicatorIds: indicatorIds,
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

    DESCRIPTORS.forEach(descriptor => {
        if (descriptor.id === 'SERIES') {
            descriptor.options = seriesOptions
        }
        if (descriptor.id === 'REF_AREA') {
            descriptor.options = areaOptions
        }
    })

    cached = true
    cachedTimestamp = Date.now()
}

function normalizeSeriesName(name) {
    // Historically the series names in this library do not include the
    // indicator ids. Recent versions of the DSD include the indicator
    // id in brackets at the end of the name.
    const regex = / \[([A-Za-z\.,0-9 ]*)\]$/
    // This regex is designed to catch ending text like:
    // [1.1.1]
    // [1.1.1,1.2.1]
    // [1.1.1, 1.2.1]
    // Etc...
    return name.replace(regex, '')
}

async function getDescriptors() {
    let expired = false
    if (cachedTimestamp !== null) {
        expired = (Date.now() - cachedTimestamp > CACHE_TTL)
    }
    if (!cached || expired) {
        console.log('fetching...')
        await cacheDescriptors()
    }
    return DESCRIPTORS
}

async function getDescriptor(findId) {
    const descriptors = await getDescriptors()
    const descriptor = descriptors.find(descriptor => descriptor.id === findId)
    if (!descriptor) {
        throw new InputError(`WARNING: Descriptor with id "${findId}" is unknown and will be skipped.`)
    }
    else {
        return descriptor
    }
}

async function getDescriptorIdByName(findName) {
    const descriptors = await getDescriptors()
    const descriptor = descriptors.find(descriptor => descriptor.name === findName)
    if (!descriptor) {
        throw new InputError(`WARNING: Descriptor with name "${findName}" is unknown and will be skipped.`)
    }
    else {
        return descriptor.id
    }
}

async function getDescriptorNameById(findId) {
    const descriptors = await getDescriptors()
    const descriptor = descriptors.find(descriptor => descriptor.id === findId)
    if (!descriptor) {
        throw new InputError(`WARNING: Descriptor with id "${findId}" is unknown and will be skipped.`)
    }
    else {
        return descriptor.name
    }
}

async function getDescriptorIds() {
    const descriptors = await getDescriptors()
    return descriptors.map(descriptor => descriptor.id)
}

async function isDescriptor(findId) {
    const descriptorIds = await getDescriptorIds()
    return descriptorIds.includes(findId)
}

async function getDescriptorOptionsById(findId) {
    const descriptors = await getDescriptors()
    const descriptor = descriptors.find(descriptor => descriptor.id === findId)
    if (!descriptor) {
        throw new InputError(`WARNING: Descriptor option with id "${findId}" is unknown and will be skipped.`)
    }
    else {
        return descriptor.options
    }
}

async function getOptionKeyByValue(optionValue, descriptorId) {
    // First look for a word in parentheses at the end.
    const words = optionValue.split(' ')
    const lastWord = words[words.length - 1]
    if (lastWord.startsWith('(') && lastWord.endsWith(')')) {
        return lastWord.slice(1, -1)
    }
    // Next fall back to a (fuzzy) hardcoded list for backwards compatibility.
    const options = await getDescriptorOptionsById(descriptorId)
    const option = options.find(item => normalizeOption(optionValue).includes(normalizeOption(item.value)));
    if (!option) {
        // In the special case of LANGUAGE, fallback to whatever is there, because
        // more recent inputs use language codes directly.
        if (descriptorId === 'LANGUAGE') {
            return optionValue
        }
        // Otherwise throw an error.
        throw new InputError(`WARNING: Descriptor option with value "${optionValue}" is unknown and will be skipped.`)
        return ''
    }
    return option.key
}

function normalizeOption(option) {
    option = option.toLowerCase()

    // At one point, indicator IDs were added to series names in brackets.
    // So strip those here for backwards compatibility.
    let words = option.split(' ')
    let lastWord = words[words.length - 1]
    if (lastWord.startsWith('[') && lastWord.endsWith(']')) {
        words.pop()
        option = words.join(' ')
    }

    // Similarly, at one point indicators IDs were at the beginning,
    // but not anymore.
    words = option.split(' ')
    let firstWord = words[0]
    if (firstWord.split('.').length === 3) {
        words.shift()
        option = words.join(' ')
    }

    return option.trim()
}

module.exports = {
    getDescriptors,
    getDescriptor,
    getDescriptorIds,
    getDescriptorIdByName,
    getDescriptorNameById,
    getDescriptorIds,
    isDescriptor,
    getDescriptorOptionsById,
    getOptionKeyByValue,
}
