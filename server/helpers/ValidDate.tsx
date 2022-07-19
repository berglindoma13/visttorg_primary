const download = require("download");
const PDFParser = require("pdf2json")

const pdfParser = new PDFParser(this,1);

// check EDP file
export const ValidDate = async({ epdUrl }) => {

  await Promise.all(
    download(epdUrl, "dist")
  )
  
  const test = pdfParser.loadPDF("/Users/mariaomarsdottir/Documents/Vinna/Github/visttorg_primary/dist/epdtestskjal.pdf");
  console.log("HERE",test)
  
};


