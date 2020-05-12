const CONCEPTS = require('./concepts.json')

function getConcepts() {
    return CONCEPTS
}

function getConcept(findId) {
    const concept = getConcepts().find(concept => concept.id === findId)
    if (!concept) {
        console.log(`WARNING: Concept with id "${findId}" cannot be found in concept-store.js.`)
    }
    else {
        return concept
    }
}

function getConceptIdByName(findName) {
    const concept = getConcepts().find(concept => concept.name === findName)
    if (!concept) {
        console.log(`WARNING: Concept with name "${findName}" cannot be found in concept-store.js.`)
    }
    else {
        return concept.id
    }
}

function getConceptNameById(findId) {
    const concept = getConcepts().find(concept => concept.id === findId)
    if (!concept) {
        console.log(`WARNING: Concept with id "${findId}" cannot be found in concept-store.js.`)
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
