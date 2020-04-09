
const BaseOutput = require('./BaseOutput')
const nunjucks = require('nunjucks')
const conceptStore = require('../concept-store')

class HtmlOutput extends BaseOutput {

    execute(metadata) {
        const prepped = this.prepForLayout(metadata)
        const html = this.getHtml(prepped)
        this.processHtml(html, metadata)
    }

    processHtml(html, metadata) {
        // This is meant to be a base class.
        throw 'processHtml not implemented'
    }

    getHtml(metadata) {
        const layoutFolder = this.options.layoutFolder || 'lib/layout'
        const layout = this.options.layout || 'simple.njk'
        nunjucks.configure(layoutFolder, { autoescape: true });
        return nunjucks.render(layout, metadata)
    }

    prepForLayout(metadata) {
        const prepped = {}
        for (const conceptId of Object.keys(metadata)) {
            const name = conceptStore.getConceptNameById(conceptId)
            if (name) {
                prepped[conceptId] = {
                    id: conceptId,
                    name: name,
                    value: metadata[conceptId],
                }
            }
        }
        return prepped
    }
}

module.exports = HtmlOutput