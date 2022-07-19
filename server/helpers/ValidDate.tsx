const download = require("download");
// const PDFParser = require("pdf2json");
const pdf = require('pdf-parse');
const fs = require("fs");

// const pdfParser = new PDFParser();

interface CertificateValidCheckProps {
  epdUrl?: string
  fscUrl?: string
  vocUrl?: string
  ceUrl?: string
}

const check = ((parsedate : Date) => {
  if (parsedate > new Date()) {
    return {message: "Valid", value: true}
  }
  else if(parsedate.toString() == "Invalid Date"){
    return {message: "Invalid Date", value: false}
  }
  else {
    return {message: "Expired Date", value: false}
  }
})

// check EDP file and FSC file
export const ValidDate = async({ epdUrl, fscUrl, vocUrl, ceUrl } : CertificateValidCheckProps) => {

  if(epdUrl != null) {
    // await Promise.all(
    //   download(epdUrl, "dist", function(err){
    //     if(err) throw err
    //     console.log("mewo")
    //   })
    // ).then((err) => {
    //   console.error('Failed', err)
    // })
    let dataBuffer = fs.readFileSync('dist/Sikasil-C%20EPD.pdf'); //dist/Sikasil-C%20EPD.pdf
    pdf(dataBuffer).then(async function(data) {
      const filedate = data.text.split("\n").filter(text=> text.includes("Valid to"))[0].replace("Valid to", ""); 
      const parsedate = new Date(filedate)
      const test = check(parsedate)
      return test
      // console.log('test epd', test)
    })
  }
  else if(fscUrl != null ){ 
    let dataBuffer = fs.readFileSync('dist/Soudabond%20Easy%20-%20EMICODE-Lizenz%203879%20-%202.8.17-e.pdf'); // dist/Soudabond%20Easy%20-%20EMICODE-Lizenz%203879%20-%202.8.17-e.pdf
    pdf(dataBuffer).then(async function(data) {
      const filedate = data.text.split("\n").filter(text=> text.includes("valid"))[1].split(" ").at(-1).split("-");
      // const swap = ([item0, item1, rest]) => [item1, item0, rest]; 
      // const newdate = swap(filedate).join("-")
      // const parsedate = new Date(newdate)
      // const test = check(parsedate)
      // return test
      // console.log('test', test)
    })
  }
  else if(vocUrl != null) {

  }
  else if(ceUrl != null) {

  }
};


