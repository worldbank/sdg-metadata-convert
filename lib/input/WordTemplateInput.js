const BaseInput = require('./BaseInput')
const mammoth = require('mammoth')
const cheerio = require('cheerio')
const pretty = require('pretty')
const conceptStore = require('../store/concept-store')
const descriptorStore = require('../store/descriptor-store')
const Metadata = require('../Metadata')

class WordTemplateInput extends BaseInput {

    read(source) {
        const mammothOptions = this.getMammothOptions()
        return mammoth.convertToHtml({ path: source }, mammothOptions).then(result => {
            if (this.options.debug) {
                console.log(result.messages)
            }
            const concepts = this.defaultConcepts()
            const descriptors = this.defaultDescriptors()
            const messages = []
            const values = {}
            const html = this.rawHtmlPreparation(result.value, messages)
            const $ = cheerio.load(html)
            this.domPreparation($)

            const info = $('body > h1:contains(Metadata Attachment)').first()
            if (info) {
                for (const descriptorId of ['REPORTING_TYPE', 'SERIES', 'REF_AREA', 'LANGUAGE']) {
                    let descriptorName
                    try {
                        descriptorName = descriptorStore.getDescriptorNameById(descriptorId)
                    } catch (e) {
                        messages.push(this.handleInputError(e))
                    }
                    // Special handling of the SERIES descriptor, which can have multiple values.
                    if (descriptorId === 'SERIES') {
                        const seriesKeys = []
                        for (const seriesCandidate of info.nextAll(':contains(' + descriptorName + ')').first().nextAll('p').toArray()) {
                            // Get as many Series codes as are available in the subsequent paragraphs.
                            const seriesCandidateText = $(seriesCandidate).text().trim()
                            // Handle blank lines.
                            if (seriesCandidateText === '') {
                                continue
                            }
                            try {
                                const seriesKey = this.getOptionValue(seriesCandidateText, 'SERIES')
                                seriesKeys.push(seriesKey)
                            } catch (e) {
                                // The first invalid Series code signals the end of the available Series codes.
                                break
                            }
                        }
                        if (seriesKeys.length < 1) {
                            messages.push('WARNING: At least one SDG Series must be selected.')
                        }
                        descriptors['SERIES'] = seriesKeys
                    }
                    else {
                        const descriptorText = info.nextAll(':contains(' + descriptorName + ')').first().next().text()
                        try {
                            descriptors[descriptorId] = this.getOptionValue(descriptorText, descriptorId)
                        } catch (e) {
                            messages.push(this.handleInputError(e))
                        }
                    }
                }
            }

            // Save the raw DSD as a "value" for potentional use later (in other code).
            const sdmxDsd = info.nextAll(':contains(<?xml)').first().text()
            values['sdmx_dsd'] = sdmxDsd

            $('body > table').each((idx, table) => {
                const section = $(table).find('> tbody > tr > td > h2, > tbody > tr > td > h1').first().text()
                if (section) {
                    const conceptsInSection = this.parseConcepts(table, $)
                    for (const [conceptName, conceptValue] of Object.entries(conceptsInSection)) {
                        try {
                            const conceptId = conceptStore.getConceptIdByName(conceptName)
                            concepts[conceptId] = conceptValue
                        } catch (e) {
                            messages.push(this.handleInputError(e))
                        }
                    }
                }
            })

            return new Metadata(concepts, descriptors, messages, values)
        })
    }

    defaultConcepts() {
        return {
            // Needed by version 2.3 of the template.
            ORGANISATION_UNIT: '',
            // Needed by version 2 "detail only" of the template.
            SDG_INDICATOR_INFO: '',
            CONTACT: '',
            IND_DEF_CON_CLASS: '',
            SRC_TYPE_COLL_METHOD: '',
            OTHER_METHOD: ''
        }
    }

    getOptionValue(optionText, selectKey) {
        return descriptorStore.getOptionKeyByValue(optionText, selectKey)
    }

    domPreparation($) {
        // Remove a lot of table-of-contents anchors that Word tends to add.
        $('a[id^=_]').remove()
    }

    getMammothOptions() {
        return {
            styleMap: [
                "p[style-name='M.Header'] => h1:fresh",
                "p[style-name='M.Sub.Header'] => h2:fresh",
                "u => u",
            ]
        }
    }

    parseConcepts(table, $) {
        const concepts = {}
        $(table).find('> tbody > tr').slice(2).each((idx, conceptRow) => {
            const conceptNameCell = $(conceptRow).find('> td:first-child')
            const conceptName = $(conceptNameCell)
                // Remove the footnotes that the names have.
                .clone().find('sup').remove().end()
                // And get the plain text that is left.
                .text().trim()
            const conceptValueCell = $(conceptRow).find('> td:nth-child(2)')
            const footnotes = this.parseFootnotes(conceptValueCell, $)

            // Confirm that this is actual content.
            if (this.isConceptValueValid(conceptValueCell, $)) {
                let conceptValue = this.prepareOutput(conceptValueCell, $)
                if (footnotes.length > 0) {
                    conceptValue += this.wrapFootnotes(footnotes)
                }
                concepts[conceptName] = conceptValue
            }
        })
        return concepts
    }

    parseFootnotes(concept, $) {
        const anchors = $(concept).find('a').filter((idx, a) => this.isFootnote(a, $))
        // Find the corresponding footnotes.
        const footnotes = $(anchors).map((idx, a) => $($(a).attr('href')))
        const hrefs = []
        const labels = []
        $(anchors).each((idx, a) => {
            hrefs.push($(a).attr('href').substring(1))
            labels.push(Number.parseInt($(a).text().replace('[', '').replace(']', '')))
        })
        // Return the footnotes as HTML.
        return $(footnotes).map((idx, footnote) => {
            return '<div><sup class="footnote-number" id="' + hrefs[idx] + '">' + labels[idx] + '</sup>' + $(footnote).html() + '</div>'
        }).get()
    }

    isFootnote(link, $) {
        const href = $(link).attr('href')
        const startsWithHash = href && href.startsWith('#')
        const parentIsSup = link.parent && link.parent.tagName === 'sup'
        return startsWithHash && parentIsSup
    }

    wrapFootnotes(footnotes) {
        return '<div class="footnotes">' + footnotes.join('') + '</div>'
    }

    isConceptValueValid(input, $) {
        // Microsoft Word can put in some weird stuff. This is a sanity check that
        // we actually have real content.
        const text = $(input).text().replace(/[^\w]/gi, '').trim()
        return text.length > 0
    }

    prepareOutput(input, $) {
        const html = $(input).html()
        return pretty(html.trim())
    }

    rawHtmlPreparation(rawHtml, messages) {
        let prepped = rawHtml.replace(/\s+/g, ' ')
        prepped = prepped.replace(this.getIncompatibleImageRegex(), (match, imageType) => {
            messages.push('An incompatible image type ("' + imageType + '") was removed.')
            return ''
        })
        return prepped
    }

    getIncompatibleImageRegex() {
        const badImageTypes = this.getIncompatibleImageTypes().join('|')
        const badImageRegex = new RegExp('<img src="data:image\/(' + badImageTypes + ')([^>]+)\/>', 'gi')
        return badImageRegex
    }

    getIncompatibleImageTypes() {
        if (this.options.incompatibleImageTypes) {
            return this.options.incompatibleImageTypes
        }
        return ['x-emf', 'tiff']
    }

}

module.exports = WordTemplateInput
