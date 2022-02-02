const conceptStore = require('../lib/store/concept-store')

class Metadata {
    constructor(concepts, descriptors, messages, values) {
        this.concepts = concepts || {}
        this.descriptors = descriptors || {}
        this.messages = messages || []
        this.values = values || []
    }

    getDescriptor(descriptorId) {
        return this.descriptors[descriptorId]
    }

    setDescriptor(descriptorId, value) {
        this.descriptors[descriptorId] = value
    }

    getConcept(conceptId) {
        return this.concepts[conceptId]
    }

    setConcept(conceptId, value) {
        this.concepts[conceptId] = value
    }

    getConcepts() {
        return this.concepts
    }

    getDescriptors() {
        return this.descriptors
    }

    getMessages() {
        return this.messages
    }

    addMessage(message) {
        this.messages.push(message)
    }

    isComplete() {
        let complete = true
        if (!this.descriptorsComplete()) {
            this.addMessage('Descriptors are not complete')
            complete = false
        }
        for (const sectionId of conceptStore.getSectionIds()) {
            if (!this.sectionComplete(sectionId)) {
                this.addMessage('Section ' + sectionId + ' is not complete.')
                complete = false
            }
        }
    }

    descriptorsComplete() {
        return this.getDescriptor('REPORTING_TYPE') &&
            this.getDescriptor('LANGUAGE') &&
            this.getDescriptor('REF_AREA') &&
            this.getDescriptor('SERIES')
    }

    sectionComplete(sectionId) {
        // A section is complete if either the main concept is populated, or
        // if at least one other is.
        if (this.getConcept(sectionId)) {
            return true
        }
        for (const conceptId of conceptStore.getConceptIdsBySectionId(sectionId)) {
            if (conceptId === sectionId) {
                continue
            }
            if (this.getConcept(conceptId)) {
                return true
            }
        }
        return false
    }

    getValue(key) {
        return this.values[key]
    }

    setValue(key, value) {
        this.values[key] = value
    }

    validateMetaLastUpdate() {
        const metaLastUpdate = this.getConcept('META_LAST_UPDATE');
        const date_regex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
        const foo = date_regex.test(metaLastUpdate);
        console.log(foo);
        return foo;
    }
}

module.exports = Metadata
