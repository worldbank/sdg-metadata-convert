const BaseInput = require('./BaseInput')
const fs = require('fs')
const gettextParser = require('gettext-parser')

/**
 * Options:
 *
 * sourceStrings: boolean
 *   Optionally specify that we only want the source strings ("msgid") instead
 *   of the translated strings ("msgstr").
 */
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
            const source = Object.keys(parsed.translations[id])[0]
            const item = parsed.translations[id][source]
            metadata[id] = (this.options.sourceStrings) ? item.msgid : item.msgstr[0]
        }

        return metadata
    }
}

module.exports = GettextInput
