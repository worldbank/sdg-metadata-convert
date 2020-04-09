// Inputs
const WordTemplateInput = require('./input/WordTemplateInput')
const GettextInput = require('./input/GettextInput')
// Outputs
const WordTemplateOutput = require('./output/WordTemplateOutput')
const GettextOutput = require('./output/GettextOutput')
const HtmlOutput = require('./output/HtmlOutput')
const PdfOutput = require('./output/PdfOutput')
// Store
const conceptStore = require('./concept-store')

module.exports = {
    WordTemplateInput,
    GettextInput,
    WordTemplateOutput,
    GettextOutput,
    HtmlOutput,
    PdfOutput,
    conceptStore,
}
