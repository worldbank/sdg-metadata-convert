const HtmlOutput = require('./HtmlOutput')
const HTMLtoDOCX = require('html-to-docx')

/**
 * Options:
 *
 * htmlToDocxOptions: object
 *   Optionally specify html-to-docx launch options.
 *   @See https://github.com/privateOmega/html-to-docx#readme
 */
class WordOutput extends HtmlOutput {

    async write(metadata, outputFile) {
        outputFile = this.getFilename(metadata, outputFile)
        const html = this.getHtml(metadata)
        const htmlToDocxOptions = this.getHtmlToDocxOptions()
        const word = await HTMLtoDOCX(html, null, htmlToDocxOptions, null)
        return this.writeFile(outputFile, word, metadata)
    }

    // Launch options for HtmlToDocx.
    getHtmlToDocxOptions() {
        return this.options.htmlToDocxOptions || {}
    }

    getFilenameExtension() {
        return 'docx'
    }
}

module.exports = WordOutput