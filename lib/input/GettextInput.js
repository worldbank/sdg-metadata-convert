const BaseInput = require('./BaseInput')
const fs = require('fs')
const gettextParser = require('gettext-parser')
const md = require('markdown-it')({
    html: true
}).use(require('markdown-it-footnote'))

/**
 * To render Markdown into HTML, set 'markdown' to true in options.
 */
class GettextInput extends BaseInput {

    _convert(output) {
        const filePath = this.source
        const po = fs.readFileSync(filePath, { encoding: 'utf-8' })
        const parsed = gettextParser.po.parse(po)

        delete parsed.translations['']

        for (const id of Object.keys(parsed.translations)) {
            let source = Object.keys(parsed.translations[id])[0]

            if (this.options['markdown']) {
                source = md.render(source)
            }

            this._setConcept(id, source)
        }

        this._to(output)
    }

}

module.exports = GettextInput
