function getDescriptors() {
    return [
        {
            id: 'REPORTING_TYPE',
            name: 'Reporting type',
            section: 'DIMENSION_DESCRIPTOR'
        },
        {
            id: 'SERIES',
            name: 'SDG series',
            section: 'DIMENSION_DESCRIPTOR'
        },
        {
            id: 'REF_AREA',
            name: 'Reference area',
            section: 'DIMENSION_DESCRIPTOR'
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

function getSectionIds() {
    return getDescriptors()
        .filter(descriptor => descriptor.id === descriptor.section)
        .map(descriptor => descriptor.id)
}

function getDescriptorIdsBySectionId(findSection) {
    return getDescriptors()
        .filter(descriptor => descriptor.section === findSection)
        .map(descriptor => descriptor.id)
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
    getSectionIds,
    getDescriptorIdsBySectionId,
    getDescriptorIds,
    isDescriptor,
}
