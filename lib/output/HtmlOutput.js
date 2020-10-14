const BaseOutput = require('./BaseOutput')
const nunjucks = require('nunjucks')
const conceptStore = require('../store/concept-store')
const path = require('path')

/**
 * Options:
 *
 * conceptNames: boolean
 *   Set this to true to display the concept names above each concept.
 *   Defaults to false.
 */
class HtmlOutput extends BaseOutput {

    write(metadata, outputFile) {
        const fileData = this.getHtml(metadata)
        return this.writeFile(outputFile, fileData, metadata)
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
        const concepts = metadata.getConcepts()
        for (const conceptId of Object.keys(concepts)) {
            const name = conceptStore.getConceptNameById(conceptId)
            if (name) {
                prepped[conceptId] = {
                    id: conceptId,
                    name: name,
                    value: concepts[conceptId],
                }
            }
        }
        prepped.conceptNames = (this.options.conceptNames === true)
        return prepped
    }
}

module.exports = HtmlOutput