const path = require('path')
const conceptStore = require('../lib/store/concept-store')
const nunjucks = require('nunjucks')
const jsDiff = require('diff')
const Diff2html = require('diff2html')
const HtmlDiff = require('htmldiff-js').default

class Diff {
    constructor(oldMeta, newMeta, title, date) {

        this.diffs = []

        for (const conceptId of Object.keys(oldMeta.getConcepts())) {
            const before = oldMeta.getConcept(conceptId)
            const after = newMeta.getConcept(conceptId)
            const name = conceptStore.getConceptNameById(conceptId) + ' (' + conceptId + ')'
            const delta = jsDiff.createTwoFilesPatch(name, name, before, after)
            const html = HtmlDiff.execute(before, after)
            this.diffs.push({ delta: delta, html: html })
        }
        this.title = title
        this.date = date
    }

    getHtml() {
        const htmlSections = []
        for (const diff of this.diffs) {
            const diffJson = Diff2html.parse(diff.delta)
            if (!diffJson[0].blocks.length) {
                continue;
            }
            const sourceDiff = Diff2html.html(diffJson, {
                drawFileList: false,
                outputFormat: 'side-by-side',
            });
            const htmlDiff = diff.html
            htmlSections.push(htmlDiff)
            //htmlSections.push(sourceDiff)
        }

        const wrappedHtmlSections = htmlSections.map(section => {
            return '<div class="sdg-diff-section">' + section + '</div>'
        })

        const layoutFolder = path.join(__dirname, 'layout')
        const layout = 'diff.njk'
        const nunjucksOptions = { autoescape: false }
        const layoutData = {
            title: this.title,
            date: this.date,
            htmlDiff: wrappedHtmlSections.join(''),
        }
        nunjucks.configure(layoutFolder, nunjucksOptions)
        return nunjucks.render(layout, layoutData)
    }
}

module.exports = Diff
