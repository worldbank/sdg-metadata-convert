# SDG metadata convert

A library in Node.js for converting SDG indicator metadata between formats.

## Installation

```
npm install --save brockfanning/sdg-metadata-concert#master
```

## Usage

Example conversion from a particular Word template to a *.pot (GetText) file:

```
const { templateInput, potOutput } = require('sdg-metadata-convert')

new templateInput('1-1-1a.docx').convertTo(new potOutput('1-1-1a.pot'))
```

And the other way around:

```
const { potInput, templateOutput } = require('sdg-metadata-convert')

new potInput('1-1-1a.pot').convertTo(new templateOutput('1-1-1a.docx'))
```
