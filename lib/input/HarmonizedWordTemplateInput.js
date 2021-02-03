const WordTemplateInput = require('./WordTemplateInput')
const mammoth = require('mammoth')
const cheerio = require('cheerio')
const pretty = require('pretty')
const conceptStore = require('../store/concept-store')
const Metadata = require('../Metadata')

class HarmonizedWordTemplateInput extends WordTemplateInput {

    read(source, descriptors) {
        const mammothOptions = this.getMammothOptions()
        return mammoth.convertToHtml({ path: source }, mammothOptions).then(result => {
            if (this.options.debug) {
                console.log(result.messages)
            }
            const messages = []
            const concepts = this.defaultConcepts()
            const values = {}
            const html = result.value
            const $ = cheerio.load(html)

            this.cleanHtml($)

            let lastConcept = null
            $('body > p, body > h1').each((idx, element) => {
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

            for (const concept of conceptStore.getConcepts()) {
                if (!(concept.id in concepts)) {
                    messages.push(concept.id + ' was not found - used "".')
                    concepts[concept.id] = ''
                }
                else {
                    concepts[concept.id] = pretty(concepts[concept.id])
                }
            }

            return new Metadata(concepts, descriptors, messages, values)
        })
    }

    defaultConcepts() {
        return {}
    }
}

module.exports = HarmonizedWordTemplateInput
