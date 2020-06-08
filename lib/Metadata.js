class Metadata {
    constructor(concepts, descriptors, messages) {
        this.concepts = concepts || {}
        this.descriptors = descriptors || {}
        this.messages = messages || []
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
}

module.exports = Metadata
