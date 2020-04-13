const HtmlOutput = require('./HtmlOutput')
const fs = require('fs')
const convertHTMLToPDF = require('pdf-puppeteer')

class PdfOutput extends HtmlOutput {

    processHtml(html, metadata) {

        // Generate the PDF.
        const lastUpdated = metadata['META_LAST_UPDATE']

        // Write a PDF file.
        const filePath = this.target
        convertHTMLToPDF(html, pdf => {
            fs.writeFileSync(filePath, pdf)
        }, this.getPuppeteerPdfOptions(lastUpdated))
    }

    // Options for pdf-puppeteer.
    getPuppeteerPdfOptions(lastUpdated) {
        return {
            // See https://github.com/puppeteer/puppeteer/issues/2182#issuecomment-543922816
            printBackground: true,
            // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagepdfoptions
            displayHeaderFooter: true,
            // Because of Puppeteer (or Chromium?) issues, we have to pass styles
            // in with the footer markup.
            footerTemplate: `
                <style>
                    #footer { padding: 0 !important; }
                    * { box-sizing: border-box; }
                    div.footer {
                        text-align: right;
                        font-size: 10px;
                        height: 30px;
                        width: 100%;
                        margin: 0 50px;
                    }
                </style>
                <div class='footer'>
                    Page: <span class='pageNumber'></span> of <span class='totalPages'></span>
                </div>
            `,
            // Because of Puppeteer (or Chromium?) issues, we have to pass styles
            // in with the header markup.
            headerTemplate: `
                <style>
                    #header { padding: 0 !important; }
                    * { box-sizing: border-box; }
                    span.header {
                        text-align: right;
                        font-size: 8px;
                        height: 50px;
                        width: 100%;
                        margin: 20px 50px 0 50px;
                    }
                </style>
                <span class='header'>
                    ${ lastUpdated }
                </span>
            `,
            format: 'A4',
            margin: {
                // These numbers tweaked to look OK despite the header/footer issues
                // linked above.
                top: '66px',
                right: '60px',
                bottom: '45px',
                left: '60px',
            },
        }
    }
}

module.exports = PdfOutput