const path = require('path')
const conceptStore = require('../lib/store/concept-store')
const nunjucks = require('nunjucks')
const jsondiffpatch = require('jsondiffpatch').create({
    textDiff: {
        minLength: 60
    }
})
const formatters = require('jsondiffpatch').formatters

class Diff {
    constructor(oldMeta, newMeta, title, date) {
        const oldJson = this.prepareMetadata(oldMeta)
        const newJson = this.prepareMetadata(newMeta)
        this.delta = jsondiffpatch.diff(oldJson, newJson)
        this.title = title
        this.date = date
    }

    prepareMetadata(metadata) {
        const prepared = {}
        for (const conceptId of Object.keys(metadata.getConcepts())) {
            const conceptName = conceptStore.getConceptNameById(conceptId)
            const newKey = `${conceptName} (${conceptId})`
            prepared[newKey] = metadata.getConcept(conceptId)
        }
        return prepared
    }

    getHtml() {
        const htmlDiff = formatters.html.format(this.delta)
        const layoutFolder = path.join(__dirname, 'layout')
        const layout = 'diff.njk'
        const nunjucksOptions = { autoescape: false }
        const layoutData = {
            title: this.title,
            date: this.date,
            htmlDiff: htmlDiff,
        }
        nunjucks.configure(layoutFolder, nunjucksOptions)
        return nunjucks.render(layout, layoutData)
    }
}

module.exports = Diff
