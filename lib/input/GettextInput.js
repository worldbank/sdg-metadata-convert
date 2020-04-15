const BaseInput = require('./BaseInput')
const fsp = require('fs').promises;
const gettextParser = require('gettext-parser')

class GettextInput extends BaseInput {

    read(source) {
        return fsp.readFile(source, { encoding: 'utf-8' }).then(data => {
            const metadata = {}
            const parsed = gettextParser.po.parse(data)
            delete parsed.translations['']

            for (const id of Object.keys(parsed.translations)) {
                let source = Object.keys(parsed.translations[id])[0]
                metadata[id] = source
            }

            return metadata
        })
    }
}

module.exports = GettextInput
