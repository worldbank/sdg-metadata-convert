const fs = require('fs')
const { create } = require('xmlbuilder2')
const yauzl = require('yauzl')
const xpath = require('xpath')

const args = process.argv.slice(2)
if (args.length < 1) {
    console.log('Please indicate the latest Word template. Example: node word-template-refresh.js my-template.docx')
    return
}

// Convert
const filePath = args[0]
yauzl.open(filePath, function(err, zipfile) {
    if (err) throw err
    zipfile.on("entry", function(entry) {
        if (entry.fileName === 'word/document.xml') {
            zipfile.openReadStream(entry, function(err, readStream) {
                if (err) throw err;
                const writeStream = fs.createWriteStream('word-template-temp')
                writeStream.on('finish', processTempFile)
                readStream.pipe(writeStream)
            });
        }
    })
})

function processTempFile() {

    const descriptorPath = './lib/store/descriptors.json'
    const descriptorData = fs.readFileSync(descriptorPath)
    const descriptors = JSON.parse(descriptorData)

    const xmlStr = fs.readFileSync('word-template-temp', { encoding: 'utf-8' })
    const doc = create(xmlStr)
    const select = xpath.useNamespaces({"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"})
    const dropDowns = select("//w:dropDownList/parent::w:sdtPr", doc.node)
    dropDowns.forEach(dropDown => {
        const dropDownTag = select("w:tag/@w:val", dropDown)[0].nodeValue
        const dropDownOptions = select("w:dropDownList/w:listItem", dropDown).map(listItem => {
            return {
                key: select("@w:value", listItem)[0].nodeValue,
                value: select("@w:displayText", listItem)[0].nodeValue
            }
        })
        descriptors.forEach(descriptor => {
            if (descriptor.templateTag === dropDownTag) {
                descriptor.options = dropDownOptions
            }
        })
    })

    const refreshed = JSON.stringify(descriptors, null, 4);
    fs.writeFileSync(descriptorPath, refreshed);
}
