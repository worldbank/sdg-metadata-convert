const baseOutput = require('./baseOutput')
const fs = require('fs')
const htmlDocx = require('html-docx-js')
const schema = require('../schema')

/**
 * NOTE: The output Word files here MUST be edited/saved in Microsoft Word
 * (not Google Docs or LibreOffice) before they can be programmatically parsed!
 * @see
 */
class templateOutput extends baseOutput {

    execute(metadata) {
        let html = '<html><body>'
        for (const sectionId of schema.getSectionIds()) {
            html += '<table><tbody>'
            const sectionName = schema.getSectionNameById(sectionId)
            html += '<tr><td><h1>' + sectionName + '</h1></td><td></td></tr>'
            html += '<tr><td>Concept name</td><td>Value</td></tr>'
            const conceptIds = schema.getConceptIdsBySectionId(sectionId)
            for (const conceptId of conceptIds) {
                const conceptName = schema.getConceptNameById(sectionId, conceptId)
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
        console.log(html)
        const docx = htmlDocx.asBlob(html)
        fs.writeFile(this.target, docx, function(err) {
            if (err) throw err;
        });
    }
}

module.exports = templateOutput
