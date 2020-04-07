const baseOutput = require('./baseOutput')
const gettextParser = require('gettext-parser')
const fs = require('fs')

class potOutput extends baseOutput {

    execute(metadata) {
        const units = {}
        for (const conceptId of Object.keys(metadata)) {
            units[conceptId] = this.getUnit(conceptId, metadata[conceptId])
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
        fs.writeFileSync(this.target, fileData)
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

module.exports = potOutput
