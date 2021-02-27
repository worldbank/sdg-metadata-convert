# SDG metadata convert

A library in Node.js for converting SDG indicator metadata between formats.

Inputs available:

* Gettext translation files
* Metadata authoring template (Microsoft Word)
* SDMX
* YAML

Outputs available:

* Gettext translation files
* HTML
* PDF
* SDMX
* YAML

## Installation

```
npm install --save worldbank/sdg-metadata-convert#master
```

## Usage

Single conversion from a particular Word template to a *.pot (Gettext) file:

```
const { WordTemplateInput, GettextOutput } = require('sdg-metadata-convert')

const input = new WordTemplateInput()
const output = new GettextOutput()

const inputFile = '3-8-2.docx'
const outputFile = '3-8-2.pot'

input.read(inputFile)
  .then(metadata => output.write(metadata, outputFile))
  .then(() => console.log(`Succeeded in converting ${inputFile} to ${outputFile}.`))
  .catch(err => console.log(err))
```

## How it works

The above example could be changed to use any of the available inputs/outputs.

* All inputs have a `read` method, which returns a Promise containing the metadata.
* All outputs have a `write` method, which returns a Promise containing the metadata.

The metadata which is returned from the inputs, and written by the outputs, is an instance of the Metadata class, which has three methods:

* `getConcepts()`
* `getDescriptors()`
* `getMessages()`

The "concepts" are the actual metadata about the SDG indicator, while the "descriptors" are metadata about the concepts. The "messages" are a list of any warnings generated during the import process.

## Looping

You may want to perform a conversion on muliple source files. For small numbers of files, you can simply loop the code above.

```
const conversions = [
  ['3-8-2.docx', '3-8-2.pot'],
  ['3-8-3.docx', '3-8-3.pot'],
]
for (const conversion of conversions) {
  const [inputFile, outputFile] = conversion
  input.read(inputFile)
    .then(metadata => output.write(metadata, outputFile))
    .then(() => console.log(`Succeeded in converting ${inputFile} to ${outputFile}.`))
    .catch(err => console.log(err))
}
```

Realize, however, that all of the conversions above are happening simultaneously.

## Looping one at a time

For large numbers of files, you may want to process them one at a time, to avoid memory/performance issues. The most readable way to do this is using an "async" function with the "await" keyword, like so:

```
async function convert() {
  for (const conversion of conversions) {
    const [inputFile, outputFile] = conversion
    try {
      const metadata = await input.read(inputFile)
      await output.write(metadata, outputFile)
      console.log(`Converted ${inputFile} to ${outputFile}.`);
    } catch(e) {
      console.log(e)
    }
  }
}
convert()
```

## Dynamic filenames

When using the `write` method of any output, the second parameter is optional. If provided it will control the filename of the output. If omitted, the filename will be dynamically created from the descriptors of the metadata set (reporting type, series, reference area).

Alternatively this parameter can be a callback function instead of a string. This callback function takes the Metadata object as a parameter, and should return a string. That returned string will be used as the filename.

## Synchronous reading

Some inputs may provide a `readSync` method, for easier use.

## Reading only

Perhaps you would like to use this library to read metadata from a source and then do something other than writing a file. This can be done like so:

```
const { WordTemplateInput } = require('sdg-metadata-convert')
const input = new WordTemplateInput()
const inputFile = '3-8-2.docx'

input.read(inputFile)
  .then(metadata => doSomething(metadata))
  .catch(err => console.log(err))

function doSomething(metadata) {
  // Do something here.
}
```

## Multiple outputs

Because the `write` methods return Promises containing the metadata, they can be "chained" so that you can convert one input into multiple outputs. For example:

```
const { WordTemplateInput, GettextOutput, PdfOutput } = require('sdg-metadata-convert')

const input = new WordTemplateInput()
const getTextOutput = new GettextOutput()
const pdfOutput = new PdfOutput()

input.read('3-8-2.docx')
  .then(metadata => getTextOutput.write(metadata, '3-8-2.pot'))
  .then(metadata => pdfOutput.write(metadata, '3-8-2.pdf'))
  .then(() => console.log('Succeeded in converting 3-8-2 to PDF and Gettext.'))
  .catch(err => console.log(err))
```

## Comparison reports

This library can also produce comparison reports between versions of the same metadata. Two different types of reports are available: "source" and "rendered".

* **Source**: This reports the precise changes in the metadata, displayed at the source-code level. This is more useful for technical audiences as it will include HTML code.
* **Rendered**: This reports the changes in the metadata in a more human-readable way, as the metadata would be rendered in final form. This is more useful for non-technical audiences.

You can produce a comparison report by first reading in the "old" metadata using an input, and then using an input's `diff` method to compare it with the "new" metadata. Here is an example of how to do this, showing an example produce these comparison reports:

```
const { WordTemplateInput } = require('sdg-metadata-convert')
const input = new WordTemplateInput()

input.read('3-8-2-old.docx')
  .then(metadata => input.compareWithNewVersion('3-8-2-new.docx', metadata))
  .then(diff => diff.writeSourcePdf('3-8-2-source-changes.pdf'))
  .then(diff => diff.writeRenderedPdf('3-8-2-rendered-changes.pdf'))
  .then(() => console.log('Succeeded in generating comparison reports.'))
  .catch(err => console.log(err))
```

Or if you want to start with the new metadata and then compare with the old:

```
input.read('3-8-2-new.docx')
  .then(metadata => input.compareWithOldVersion('3-8-2-old.docx', metadata))
  ...
```

Note that the two inputs need not be the same. For example, you can compare the metadata contained in a Word template with the metadata contained in an SDMX file.

These reports can be written as HTML files (`writeSourceHtml` and `writeRenderedHtml`) or PDF files (`writeSourcePdf` and `writeRenderedPdf`).
