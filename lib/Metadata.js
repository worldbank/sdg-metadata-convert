const conceptStore = require('../lib/store/concept-store')

class Metadata {
    constructor(concepts, descriptors, messages) {
        this.concepts = concepts || {}
        this.descriptors = descriptors || {}
        this.messages = messages || []
        this.setDefaults()
    }

    setDefaults() {
        if (!this.getDescriptor('LANGUAGE')) {
            this.setDescriptor('LANGUAGE', 'en')
        }
        // Backwards compatibility for some older versions of certain inputs.
        const backwardsCompatibilityEmptyStrings = [
            // Needed by WordTemplateInput version 2.3.
            'ORGANISATION_UNIT',
            // Needed by WordTemplateInput version 2-detail only.
            'SDG_INDICATOR_INFO',
            'CONTACT',
            'IND_DEF_CON_CLASS',
            'SRC_TYPE_COLL_METHOD',
            'OTHER_METHOD',
        ]
        for (const conceptId of backwardsCompatibilityEmptyStrings) {
            if (!this.getConcept(conceptId)) {
                this.setConcept(conceptId, '')
            }
        }
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
}

module.exports = Metadata
