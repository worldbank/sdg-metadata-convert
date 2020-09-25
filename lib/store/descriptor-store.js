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

function getOptionKeyByValue(optionValue) {
    const optionParts = optionValue.split(' --- ')
    if (optionParts.length < 2) {
        throw new InputError(`WARNING: Descriptor option with value "${optionValue}" is unknown and will be skipped.`)
        return ''
    }
    return optionParts[1]
}

module.exports = {
    getDescriptors,
    getDescriptor,
    getDescriptorIds,
    getDescriptorIdByName,
    getDescriptorNameById,
    getDescriptorIds,
    isDescriptor,
    getOptionKeyByValue,
}
