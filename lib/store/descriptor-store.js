const DESCRIPTORS = require('./descriptors.json')

function getDescriptors() {
    return DESCRIPTORS
}

function getDescriptor(findId) {
    const descriptor = getDescriptors().find(descriptor => descriptor.id === findId)
    if (!descriptor) {
        console.log(`WARNING: Descriptor with id "${findId}" cannot be found in descriptor-store.js.`)
    }
    else {
        return descriptor
    }
}

function getDescriptorIdByName(findName) {
    const descriptor = getDescriptors().find(descriptor => descriptor.name === findName)
    if (!descriptor) {
        console.log(`WARNING: Descriptor with name "${findName}" cannot be found in descriptor-store.js.`)
    }
    else {
        return descriptor.id
    }
}

function getDescriptorNameById(findId) {
    const descriptor = getDescriptors().find(descriptor => descriptor.id === findId)
    if (!descriptor) {
        console.log(`WARNING: Descriptor with id "${findId}" cannot be found in descriptor-store.js.`)
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
        console.log(`WARNING: Descriptor with id "${findId}" cannot be found in descriptor-store.js.`)
    }
    else {
        return descriptor.options
    }
}

function getOptionKeyByValue(optionValue, descriptorId) {
    const options = getDescriptorOptionsById(descriptorId)
    const option = options.find(item => item.value === optionValue);
    if (!option) {
        console.log(`WARNING: Descriptor option with value "${optionValue}" cannot be found in descriptor-store.js.`)
        return ''
    }
    return option.key
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
