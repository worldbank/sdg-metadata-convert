const BaseInput = require('./BaseInput')
const mammoth = require('mammoth')
const cheerio = require('cheerio')
const pretty = require('pretty')
const conceptStore = require('../concept-store')

class WordTemplateInput extends BaseInput {

    _convert(output) {
        const that = this
        const options = {
            styleMap: [
                "p[style-name='M.Header'] => h1:fresh",
                "p[style-name='M.Sub.Header'] => h2:fresh",
            ]
        }
        mammoth.convertToHtml({ path: that.source }, options)
            .then(function(result) {
                const html = result.value
                const $ = cheerio.load(html)
                that.$ = $
                // First remove a lot of table-of-contents anchors that Word
                // tends to add.
                $('a[id^=_Toc]').remove()
                $('body > table').each((idx, table) => {
                    const section = $(table).find('> tbody > tr > td > h1').first().text()
                    if (section) {
                        const concepts = that.parseConcepts(table)
                        for (const [conceptName, conceptValue] of Object.entries(concepts)) {
                            const conceptId = conceptStore.getConceptIdByName(conceptName)
                            that._setConcept(conceptId, conceptValue)
                        }
                    }
                })

                that._to(output)
            })
            .done()
    }

    parseConcepts(table) {
        const concepts = {}
        const that = this
        const $ = that.$
        $(table).find('> tbody > tr').slice(2).each((idx, conceptRow) => {
            const conceptNameCell = $(conceptRow).find('> td:first-child')
            const conceptName = $(conceptNameCell)
                // Remove the footnotes that the names have.
                .clone().find('sup').remove().end()
                // And get the plain text that is left.
                .text().trim()
            const conceptValueCell = $(conceptRow).find('> td:nth-child(2)')
            const footnotes = that.parseFootnotes(conceptValueCell)

            // Confirm that this is actual content.
            if (that.isConceptValueValid(conceptValueCell)) {
                let conceptValue = that.prepareOutput(conceptValueCell)
                if (footnotes.length > 0) {
                    conceptValue += that.wrapFootnotes(footnotes)
                }
                concepts[conceptName] = conceptValue
            }
        })
        return concepts
    }

    parseFootnotes(concept) {
        const that = this
        const $ = that.$
        const anchors = $(concept).find('a').filter((idx, a) => that.isFootnote(a))
        // Find the corresponding footnotes.
        const footnotes = $(anchors).map((idx, a) => $($(a).attr('href')))
        const footnoteNumbers = $(anchors).map((idx, a) => {
            return Number.parseInt($(a).text().replace('[', '').replace(']', ''))
        })
        // Return the HTML (list items).
        return $(footnotes).map((idx, footnote) => {
            const number = footnoteNumbers[idx]
            // These are already list items, but we will have the "value"
            // attribute so that in ordered lists, they will have a particular
            // number.
            $(footnote).attr('value', number)
            // In addition, we put the number inside the element so that there
            // is actual markup referencing the number. These can be hidden
            // at the presentation layer if needed.
            $(footnote).prepend('<sup class="footnote-number">' + number + '</sup>')
            return $.html(footnote)
        }).get()
    }

    isFootnote(link) {
        const href = this.$(link).attr('href')
        const startsWithHash = href && href.startsWith('#')
        const parentIsSup = link.parent && link.parent.tagName === 'sup'
        return startsWithHash && parentIsSup
    }

    wrapFootnotes(footnotes) {
        return '<ol class="footnotes">' + footnotes.join('') + '</ol>'
    }

    isConceptValueValid(input) {
        // Microsoft Word can put in some weird stuff. This is a sanity check that
        // we actually have real content.
        const text = this.$(input).text().replace(/[^\w]/gi, '').trim()
        return text.length > 0
    }

    prepareOutput(input) {
        const html = this.$(input).html()
        return pretty(html.trim())
    }

}

module.exports = WordTemplateInput
