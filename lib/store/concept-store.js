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

function getConceptIdByName(findName, fuzzy=true, replacements={}) {
    // First, if it ends with parenthesis, see if that is the id.
    const parens = findName.split('(')
    const lastParen = parens[parens.length - 1]
    if (lastParen.endsWith(')')) {
        const potentialId = lastParen.slice(0, -1)
        try {
            const concept = this.getConcept(potentialId)
            return concept.id
        } catch(error) {
            // Do nothing to continue.
        }
    }
    // Otherwise continue to try to find by name.
    if (replacements && Object.keys(replacements).includes(findName)) {
        findName = replacements[findName];
    }
    const findNameFuzzy = normalizeName(findName)
    let callback = concept => concept.name === findName
    if (fuzzy) {
        callback = concept => {
            return normalizeName(concept.name) === findNameFuzzy
        }
    }
    const concept = getConcepts().find(callback)
    if (!concept) {
        throw new InputError(`WARNING: Concept with name "${findName}" is unknown and will be skipped.`)
    }
    else {
        return concept.id
    }
}

function normalizeName(name) {
    return name
        // Avoid casing discrepancies.
        .toLowerCase()
        // Avoid issues with missing dots.
        .replace(/\./g, '')
        // Ignore preceding/trailing spaces.
        .trim()
}

function getConceptNameById(findId) {
    return getConcept(findId).name
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

function getConceptTranslations() {
    const translations = {}
    for (const concept of getConcepts()) {
        translations[concept.id] = concept.name
    }
    return translations
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
    getConceptTranslations,
}
