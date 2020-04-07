const baseInput = require('./baseInput')
const fs = require('fs')
const gettextParser = require('gettext-parser')

class potInput extends baseInput {

    _convert(output) {
        const filePath = this.source
        const po = fs.readFileSync(filePath, { encoding: 'utf-8' })
        const parsed = gettextParser.po.parse(po)

        delete parsed.translations['']

        for (const id of Object.keys(parsed.translations)) {
            const source = Object.keys(parsed.translations[id])[0]
            this._setConcept(id, source)
        }

        this._to(output)
    }

}

module.exports = potInput
