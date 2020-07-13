const path = require('path')
const WordTemplateInput = require('../lib/input/WordTemplateInput')
const input = new WordTemplateInput()
const inputFile = path.join('test', 'inputs', 'SDG_Metadata_Authoring_Tool__Word_v2.2.docx')

input.read(inputFile)
  .then(metadata => testMetadata(metadata))
  .catch(err => console.log(err))

function testMetadata(metadata) {
  console.log(metadata);
}
