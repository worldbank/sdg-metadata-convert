class Metadata {
    constructor(concepts, descriptors) {
        this.concepts = concepts || {}
        this.descriptors = descriptors || {}
        this.messages = []
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
}

module.exports = Metadata
