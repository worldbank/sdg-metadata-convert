function getDescriptors() {
    return [
        {
            id: 'REPORTING_TYPE',
            name: 'Reporting type',
        },
        {
            id: 'SERIES',
            name: 'SDG series',
        },
        {
            id: 'REF_AREA',
            name: 'Reference area',
        },
    ]
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

module.exports = {
    getDescriptors,
    getDescriptor,
    getDescriptorIds,
    getDescriptorIdByName,
    getDescriptorNameById,
    getDescriptorIds,
    isDescriptor,
}
