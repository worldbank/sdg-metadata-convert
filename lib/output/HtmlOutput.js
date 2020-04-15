const BaseOutput = require('./BaseOutput')
const nunjucks = require('nunjucks')
const conceptStore = require('../concept-store')
const path = require('path')
const fsp = require('fs').promises;

class HtmlOutput extends BaseOutput {

    write(metadata, outputFile) {
        const fileData = this.getHtml(metadata)
        return fsp.writeFileSync(outputFile, fileData)
    }

    getHtml(metadata) {
        const layoutData = this.prepForLayout(metadata)
        const layoutFolder = this.options.layoutFolder || path.join(__dirname, '..', 'layout')
        const layout = this.options.layout || 'simple.njk'
        const nunjucksOptions = this.options.nunjucksOptions || { autoescape: false }
        nunjucks.configure(layoutFolder, nunjucksOptions);
        return nunjucks.render(layout, layoutData)
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