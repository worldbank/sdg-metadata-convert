const HtmlOutput = require('./HtmlOutput')
const HtmlDocx = require('html-docx-js')

/**
 * Options:
 *
 * htmlDocxJs: object
 *   Optionally specify html-docx-js options.
 *   @See https://github.com/evidenceprime/html-docx-js
 */
class WordOutput extends HtmlOutput {

    async write(metadata, outputFile) {
        outputFile = this.getFilename(metadata, outputFile)
        const html = this.getHtml(metadata)
        const options = this.getHtmlDocxJsOptions()
        const word = HtmlDocx.asBlob(html, options);
        return this.writeFile(outputFile, word, metadata)
    }

    // Launch options for htmlDocxJs.
    getHtmlDocxJsOptions() {
        return this.options.htmlDocxJs || {}
    }

    getFilenameExtension() {
        return 'docx'
    }
}

module.exports = WordOutput