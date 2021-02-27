const BaseOutput = require('./BaseOutput')
const yaml = require('js-yaml')

class YamlOutput extends BaseOutput {

    write(metadata, outputFile) {
        const concepts = metadata.getConcepts()
        const conceptsWithContent = {}
        for (const key of Object.keys(concepts)) {
            if (concepts[key]) {
                conceptsWithContent[key] = concepts[key]
            }
        }
        const fileData = yaml.dump(conceptsWithContent)
        outputFile = this.getFilename(metadata, outputFile)
        return this.writeFile(outputFile, fileData, metadata)
    }

    getFilenameExtension() {
        return 'yml'
    }
}

module.exports = YamlOutput
