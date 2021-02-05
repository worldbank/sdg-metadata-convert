const WordTemplateInput = require('./WordTemplateInput')
const mammoth = require('mammoth')
const cheerio = require('cheerio')
const pretty = require('pretty')
const conceptStore = require('../store/concept-store')
const Metadata = require('../Metadata')

class HarmonizedWordTemplateInput extends WordTemplateInput {

    /**
     * Unlike other inputs, this requires the descriptors to be passed in.
     * This is because the source has no information on descriptors.
     *
     * @param {String} source
     * @param {Object} descriptors
     */
    read(source, descriptors) {
        const mammothOptions = this.getMammothOptions()
        console.log('About to convert HTML')
        return mammoth.convertToHtml({ path: source }, mammothOptions).then(result => {
            if (this.options.debug) {
                console.log(result.messages)
            }
            const messages = []
            const concepts = this.defaultConcepts()
            const values = {}
            const html = result.value.replace(/\s+/g, ' ')
            console.log('About to load Cheerio')
            const $ = cheerio.load(html)

            this.cleanHtml($)
            const imagesRemoved = this.removeIncompatibleImages($)
            for (const imageRemoved of imagesRemoved) {
                messages.push('An incompatible image type ("' + imageRemoved + '") was removed.')
            }
            this.flagOldFootnotes($)

            let lastConcept = null
            $('body > *').each((idx, element) => {
                const text = $(element).text()
                try {
                    const conceptId = conceptStore.getConceptIdByName(text)
                    lastConcept = conceptId
                    concepts[lastConcept] = ''
                }
                catch(err) {
                    if (lastConcept != null) {
                        concepts[lastConcept] += $.html(element)
                    }
                }
            })

            // Loop through what we found in order to catch footnotes.
            for (const conceptId in concepts) {
                const element = $('<div>' + concepts[conceptId] + '</div>')
                const footnotes = this.parseFootnotes(element, $)
                if (this.isConceptValueValid(element, $)) {
                    this.stripOldFootnotes(element, $)
                    let conceptValue = this.prepareOutput(element, $)
                    if (footnotes.length > 0) {
                        conceptValue += this.wrapFootnotes(footnotes)
                    }
                    concepts[conceptId] = conceptValue
                }
                else {
                    concepts[conceptId] = ''
                }
            }

            // Loop through what we *should* have found, to generate warnings.
            for (const concept of conceptStore.getConcepts()) {
                if (!(concept.id in concepts)) {
                    messages.push(concept.id + ' was not found - used "".')
                    concepts[concept.id] = ''
                }
            }

            return new Metadata(concepts, descriptors, messages, values)
        })
    }

    defaultConcepts() {
        return {}
    }

    flagOldFootnotes($) {
        // Mammoth doesn't clearly mark footnotes, so we assume that if
        // the last child is an ordered list with all list items that
        // have ID attributes, it is the footnotes.
        const lastList = $('body > ol:last-child')
        if (lastList.length === 0) {
            return
        }
        const nonFootnotes = $(lastList).find('li:not([id])')
        if (nonFootnotes.length === 0) {
            $(lastList).attr('class', 'sdg-footnotes')
        }
    }

    stripOldFootnotes(element, $) {
        $(element).find('.sdg-footnotes').remove()
    }
}

module.exports = HarmonizedWordTemplateInput
