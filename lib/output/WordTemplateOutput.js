const BaseOutput = require('./BaseOutput')
const fs = require('fs')
const htmlDocx = require('html-docx-js')
const conceptStore = require('../concept-store')

/**
 * NOTE: The output Word files here MUST be edited/saved in Microsoft Word
 * (not Google Docs or LibreOffice) before they can be programmatically parsed!
 * @see
 */
class WordTemplateOutput extends BaseOutput {

    execute(metadata) {
        const newFields = {}
        const oldFields = metadata
        const newMainFields = []
        let html = '<html><body>'
        for (const sectionId of conceptStore.getSectionIds()) {
            newMainFields.push(sectionId)
            html += '<table><tbody>'
            const sectionName = conceptStore.getConceptNameById(sectionId)
            html += '<tr><td><h1>' + sectionName + '</h1></td><td></td></tr>'
            html += '<tr><td>Concept name</td><td>Value</td></tr>'
            const conceptIds = conceptStore.getConceptIdsBySectionId(sectionId)
            for (const conceptId of conceptIds) {
                newFields[conceptId] = true
                const conceptName = conceptStore.getConceptNameById(conceptId)
                // If there are multiple components, we don't want to list the
                // main concept.
                if (conceptIds.length > 1 && conceptId === sectionId) {
                    continue
                }
                const conceptValue = (!(conceptId in metadata)) ? '' : metadata[conceptId]
                html += '<tr><td>' + conceptName + '</td><td>' + conceptValue + '</td></tr>'
            }
            html += '</tbody></table>'
        }
        html += '</body></html>'
        const docx = htmlDocx.asBlob(html)
        fs.writeFile(this.target, docx, function(err) {
            if (err) throw err;
        });

        // Temporary debug code.
        const oldFieldIds = Object.keys(oldFields)
        const newFieldIds = Object.keys(newFields)
        for (const oldFieldId of oldFieldIds) {
            if (!newFieldIds.includes(oldFieldId)) {
                console.log(oldFieldId + ' is not in the new schema.')
            }
        }
        for (const newFieldId of newFieldIds) {
            if (!newMainFields.includes(newFieldId) && !oldFieldIds.includes(newFieldId)) {
                console.log(newFieldId + ' was not present in the metadata.')
            }
        }
    }
}

module.exports = WordTemplateOutput
