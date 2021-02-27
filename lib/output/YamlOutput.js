const BaseOutput = require('./BaseOutput')
const yaml = require('js-yaml')

class YamlOutput extends BaseOutput {

    write(metadata, outputFile) {
        const concepts = metadata.getConcepts()
        const fileData = yaml.dump(concepts)
        outputFile = this.getFilename(metadata, outputFile)
        return this.writeFile(outputFile, fileData, metadata)
    }

    getFilenameExtension() {
        return 'yml'
    }
}

module.exports = YamlOutput
