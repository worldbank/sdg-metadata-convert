const BaseOutput = require('./BaseOutput')
const createReport = require('docx-templates').createReport
const fsp = require('fs').promises

class WordTemplateOutput extends BaseOutput {

    async write(metadata, outputFile) {
        outputFile = this.getFilename(metadata, outputFile)
        const template = await fsp.readFile('lib/templates/SDG_Metadata_Template.docm')
        const concepts = metadata.getConcepts()
        const data = {}
        for (const [key, value] of Object.entries(concepts)) {
            data[key] = (value) ? '<body>' + value + '</body>' : ''
        }
        const buffer = await createReport({
            template: template,
            data: data,
        })
        return this.writeFile(outputFile, buffer, metadata)
    }

    getFilenameExtension() {
        return 'docm'
    }
}

module.exports = WordTemplateOutput