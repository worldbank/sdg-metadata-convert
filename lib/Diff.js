const path = require('path')
const conceptStore = require('../lib/store/concept-store')
const nunjucks = require('nunjucks')
const jsDiff = require('diff');
const Diff2html = require('diff2html');

class Diff {
    constructor(oldMeta, newMeta, title, date) {

        this.diffs = []

        for (const conceptId of Object.keys(oldMeta.getConcepts())) {
            const before = oldMeta.getConcept(conceptId)
            const after = newMeta.getConcept(conceptId)
            const name = conceptStore.getConceptNameById(conceptId) + ' (' + conceptId + ')'
            this.diffs.push(jsDiff.createTwoFilesPatch(name, name, before, after))
        }
        this.title = title
        this.date = date
    }

    getHtml() {
        const diffJsons = this.diffs.map(diff => {
            return Diff2html.parse(diff)
        })
        const changes = diffJsons.filter(diffJson => {
            return diffJson[0].blocks.length
        })
        const diffs = changes.map(diff => {
            return Diff2html.html(diff, {
                drawFileList: false,
                outputFormat: 'side-by-side',
            });
        })

        const layoutFolder = path.join(__dirname, 'layout')
        const layout = 'diff.njk'
        const nunjucksOptions = { autoescape: false }
        const layoutData = {
            title: this.title,
            date: this.date,
            htmlDiff: diffs.join(''),
        }
        nunjucks.configure(layoutFolder, nunjucksOptions)
        return nunjucks.render(layout, layoutData)
    }
}

module.exports = Diff
