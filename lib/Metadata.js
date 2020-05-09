class Metadata {
    constructor(concepts, descriptors) {
        this.concepts = concepts || {}
        this.descriptors = descriptors || {}
    }

    getConcepts() {
        return this.concepts
    }

    getDescriptors() {
        return this.descriptors
    }
}

module.exports = Metadata
