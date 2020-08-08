const path = require('path')
const conceptStore = require('../lib/store/concept-store')
const nunjucks = require('nunjucks')
const jsondiffpatch = require('jsondiffpatch').create({
    textDiff: {
        minLength: 60
    }
})
const formatters = require('jsondiffpatch').formatters

class Metadata {
    constructor(concepts, descriptors, messages) {
        this.concepts = concepts || {}
        this.descriptors = descriptors || {}
        this.messages = messages || []
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

    diffReady() {
        const ready = {}
        for (const conceptId of Object.keys(this.getConcepts())) {
            const conceptName = conceptStore.getConceptNameById(conceptId)
            const newKey = `${conceptName} (${conceptId})`
            ready[newKey] = this.getConcept(conceptId)
        }
        return ready
    }

    diff(metadata, title, date) {
        // Perform a diff using self as "a" and the passed argument as "b".
        const delta = jsondiffpatch.diff(this.diffReady(), metadata.diffReady())
        const diff = formatters.html.format(delta)
        const layoutFolder = path.join(__dirname, 'layout')
        const layout = 'diff.njk'
        const nunjucksOptions = { autoescape: false }
        const layoutData = {
            title: title,
            date: date,
            diff: diff
        }
        nunjucks.configure(layoutFolder, nunjucksOptions)
        return nunjucks.render(layout, layoutData)
    }
}

module.exports = Metadata
