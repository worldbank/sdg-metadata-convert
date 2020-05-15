const BaseOutput = require('./BaseOutput')
const gettextParser = require('gettext-parser')

/**
 * Options:
 *
 * language: string
 *   Optionally specify a language to put into the header.
 */
class GettextOutput extends BaseOutput {

    write(metadata, outputFile) {
        const units = {}
        const concepts = metadata.getConcepts()
        for (const conceptId of Object.keys(concepts)) {
            units[conceptId] = this.getUnit(concepts[conceptId], conceptId)
        }

        const data = {
            headers: this.getHeader(),
            translations: {
                "": units
            }
        }

        const fileData = gettextParser.po.compile(data)
        return this.writeFile(outputFile, fileData, metadata)
    }

    getHeader() {
        const header = {}
        header['MIME-Version'] ='1.0'
        if (this.options.language) {
            header['Language'] = this.options.language
        }
        header['Content-Type'] = 'text/plain; charset=UTF-8'
        header['Content-Transfer-Encoding'] = '8bit'
        return header
    }

    // Generate translatable units.
    getUnit(source, context) {
        if (typeof string !== 'string') {
            source = String(source)
        }
        return {
            msgctxt: context,
            msgid: source.replace(/\r\n/g, "\n"),
            msgstr: '',
        }
    }
}

module.exports = GettextOutput
