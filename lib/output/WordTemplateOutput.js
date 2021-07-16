const BaseOutput = require('./BaseOutput')
const createReport = require('docx-templates').createReport
const fsp = require('fs').promises
const path = require('path')

/**
 * Options:
 *
 * template: string
 *   Optionally specify a path to a custom template file.
 */
class WordTemplateOutput extends BaseOutput {

    async write(metadata, outputFile) {
        outputFile = this.getFilename(metadata, outputFile)
        const defaultTemplate = path.join(__dirname, '..', 'templates', 'SDG_Metadata_Template.docm')
        const templatePath = this.options.template ? this.options.template : defaultTemplate
        const template = await fsp.readFile(templatePath)
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