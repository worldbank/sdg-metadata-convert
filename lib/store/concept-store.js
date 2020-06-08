const CONCEPTS = require('./concepts.json')
const InputError = require('../InputError')

function getConcepts() {
    return CONCEPTS
}

function getConcept(findId) {
    const concept = getConcepts().find(concept => concept.id === findId)
    if (!concept) {
        throw new InputError(`WARNING: Concept with id "${findId}" is unknown and will be skipped.`)
    }
    else {
        return concept
    }
}

function getConceptIdByName(findName) {
    const concept = getConcepts().find(concept => concept.name === findName)
    if (!concept) {
        throw new InputError(`WARNING: Concept with name "${findName}" is unknown and will be skipped.`)
    }
    else {
        return concept.id
    }
}

function getConceptNameById(findId) {
    const concept = getConcepts().find(concept => concept.id === findId)
    if (!concept) {
        throw new InputError(`WARNING: Concept with id "${findId}" is unknown and will be skipped.`)
    }
    else {
        return concept.name
    }
}

function getSectionIds() {
    return getConcepts()
        .filter(concept => concept.id === concept.section)
        .map(concept => concept.id)
}

function getConceptIdsBySectionId(findSection) {
    return getConcepts()
        .filter(concept => concept.section === findSection)
        .map(concept => concept.id)
}

function getConceptIds() {
    return getConcepts().map(concept => concept.id)
}

function isConcept(findId) {
    return getConceptIds().includes(findId)
}

module.exports = {
    getConcepts,
    getConcept,
    getConceptIdByName,
    getConceptNameById,
    getSectionIds,
    getConceptIdsBySectionId,
    getConceptIds,
    isConcept,
}
