# SDG metadata convert

A library in Node.js for converting SDG indicator metadata between formats.

## Installation

```
npm install --save brockfanning/sdg-metadata-convert#master
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
* All outputs have a `write` method, which returns a Promise (containing nothing).

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

## Synchronous reading

Some inputs may provide a `readSync` method, for easier use.
