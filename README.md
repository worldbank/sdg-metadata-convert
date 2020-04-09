# SDG metadata convert

A library in Node.js for converting SDG indicator metadata between formats.

## Installation

```
npm install --save brockfanning/sdg-metadata-convert#master
```

## Usage

Example conversion from a particular Word template to a *.pot (GetText) file:

```
const { WordTemplateInput, PotOutput } = require('sdg-metadata-convert')

new WordTemplateInput('1-1-1a.docx').convertTo(new PotOutput('1-1-1a.pot'))
```

And the other way around:

```
const { PotInput, WordTemplateOutput } = require('sdg-metadata-convert')

new PotInput('1-1-1a.pot').convertTo(new WordTemplateOutput('1-1-1a.docx'))
```
