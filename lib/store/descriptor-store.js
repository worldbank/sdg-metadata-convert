const DESCRIPTORS = require('./descriptors.json')
const InputError = require('../InputError')

function getDescriptors() {
    return DESCRIPTORS
}

function getDescriptor(findId) {
    const descriptor = getDescriptors().find(descriptor => descriptor.id === findId)
    if (!descriptor) {
        throw new InputError(`WARNING: Descriptor with id "${findId}" is unknown and will be skipped.`)
    }
    else {
        return descriptor
    }
}

function getDescriptorIdByName(findName) {
    const descriptor = getDescriptors().find(descriptor => descriptor.name === findName)
    if (!descriptor) {
        throw new InputError(`WARNING: Descriptor with name "${findName}" is unknown and will be skipped.`)
    }
    else {
        return descriptor.id
    }
}

function getDescriptorNameById(findId) {
    const descriptor = getDescriptors().find(descriptor => descriptor.id === findId)
    if (!descriptor) {
        throw new InputError(`WARNING: Descriptor with id "${findId}" is unknown and will be skipped.`)
    }
    else {
        return descriptor.name
    }
}

function getDescriptorIds() {
    return getDescriptors().map(descriptor => descriptor.id)
}

function isDescriptor(findId) {
    return getDescriptorIds().includes(findId)
}

function getDescriptorOptionsById(findId) {
    const descriptor = getDescriptors().find(descriptor => descriptor.id === findId)
    if (!descriptor) {
        throw new InputError(`WARNING: Descriptor option with id "${findId}" is unknown and will be skipped.`)
    }
    else {
        return descriptor.options
    }
}

function getOptionKeyByValue(optionValue, descriptorId) {
    // First look for a word in parentheses at the end.
    const words = optionValue.split(' ')
    const lastWord = words[words.length - 1]
    if (lastWord.startsWith('(') && lastWord.endsWith(')')) {
        return lastWord.slice(1, -1)
    }
    // Next fall back to a (fuzzy) hardcoded list for backwards compatibility.
    const options = getDescriptorOptionsById(descriptorId)
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
