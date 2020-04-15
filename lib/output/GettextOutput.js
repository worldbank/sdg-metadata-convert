const BaseOutput = require('./BaseOutput')
const gettextParser = require('gettext-parser')
const fsp = require('fs').promises;

class GettextOutput extends BaseOutput {

    write(metadata, outputFile) {
        const units = {}
        for (const conceptId of Object.keys(metadata)) {
            units[conceptId] = this.getUnit(metadata[conceptId], conceptId)
        }

        const data = {
            headers: {
                'MIME-Version': '1.0',
                'Content-Type': 'text/plain; charset=UTF-8',
                'Content-Transfer-Encoding': '8bit'
            },
            translations: {
                "": units
            }
        }

        const fileData = gettextParser.po.compile(data)
        return fsp.writeFile(outputFile, fileData)
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
