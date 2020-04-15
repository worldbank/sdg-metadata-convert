const BaseInput = require('./BaseInput')
const fs = require('fs')
const gettextParser = require('gettext-parser')

class GettextInput extends BaseInput {

    read(source) {
        return fs.promises.readFile(source, { encoding: 'utf-8' }).then(data => this.parse(data))
    }

    readSync(source) {
        const data = fs.readFileSync(source, { encoding: 'utf-8' })
        return this.parse(data)
    }

    parse(data) {
        const metadata = {}
        const parsed = gettextParser.po.parse(data)
        delete parsed.translations['']

        for (const id of Object.keys(parsed.translations)) {
            let source = Object.keys(parsed.translations[id])[0]
            metadata[id] = source
        }

        return metadata
    }
}

module.exports = GettextInput
