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
 * language: string
 *   Optionally specify a language to affect the HTML text direction.
 *   This overrides whatever might be in the LANGUAGE descriptor.
 * conceptTranslations: object
 *   Only used if conceptNames is true. Provides an object keyed by
 *   language pointing to objects keyed by concept ID, pointing to
 *   concept names. If a concept ID is missing from the object, the
 *   default (English) concept name will be used. Eg:
 *
 *   {
 *     ru: {
 *       SDG_INDICATOR_INFO: '0. Информация о показателе'
 *     },
 *     es: {
 *       SDG_INDICATOR_INFO: '0. Información del indicador'
 *     }
 *   }
 */
class HtmlOutput extends BaseOutput {

    write(metadata, outputFile) {
        outputFile = this.getFilename(metadata, outputFile)
        const fileData = this.getHtml(metadata)
        return this.writeFile(outputFile, fileData, metadata)
    }

    getHtml(metadata) {
        const layoutData = this.prepForLayout(metadata)
        const descriptors = metadata.getDescriptors()
        const language = this.getLanguage(descriptors)
        layoutData['rightToLeft'] = this.isRightToLeftLanguage(language)
        layoutData['conceptTranslations'] = this.getConceptTranslationsForLanguage(language)
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

    getFilenameExtension() {
        return 'html'
    }

    isRightToLeftLanguage(language) {
        const rtl = ['ar']
        return rtl.includes(language)
    }

    getConceptTranslationsForLanguage(language) {
        if (this.options.conceptTranslations && this.options.conceptTranslations[language]) {
            return this.options.conceptTranslations[language]
        }
        return store.getConceptTranslations()
    }
}

module.exports = HtmlOutput