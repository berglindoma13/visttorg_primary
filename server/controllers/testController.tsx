import { PrismaClient } from '@prisma/client'
import certificates from '../../mappers/certificates';
const reader = require('g-sheets-api');
const fs = require('file-system');
const download = require("download");
const pdf = require('pdf-parse');
const nodemailer = require("nodemailer");
import { Certificate } from '../types/models'
import { CertificateValidator } from '../helpers/CertificateValidator'
import { applyReferentialEqualityAnnotations } from 'superjson/dist/plainer';
// import { ValidDate } from '../helpers/ValidDate'

const prisma = new PrismaClient()

// company id 2, get data from google sheets and insert into database

interface result {
  id: string,
  prodName: string,
  longDescription: string,
  shortDescription: string,
  fl: string,
  prodImage: string,
  url: string,
  brand: string,
  fscUrl: string,
  epdUrl: string,
  vocUrl: string,
  ceUrl: string,
  certificates: [
    { name: string, val: string },
    { name: string, val: string },
    { name: string, val: string },
    { name: string, val: string },
    { name: string, val: string },
    { name: string, val: string },
    { name: string, val: string },
    { name: string, val: string },
    { name: string, val: string },
  ]
}

interface allResults {
  obj: Array<result>,
  length: number
}

interface validDateObj {
  message: string,
  date ?: Date 
}

var updatedProducts = [];
var createdProducts = [];
// var productsNoLongerComingInFromFile = [];
var productsNotValid = [];

export const InsertAllSheetsProducts = async(req,res) => {
  // get all data from sheets file
  getProducts();
  // write all appropriate files
  createdProductsWriteFile();
  updatedProductsWriteFile();
  productsNoLongerValidWriteFile();
  res.end('All products inserted')
}

export const DeleteAllSheetsProducts = async(req,res) => {
  // delete all products with company id 2
  await prisma.product.deleteMany({
    where: {
      companyid: 2
    }
  })
  res.end("All deleted");
}

export const DeleteAllSheetsCert = async(req,res) => {
  // delete all product certificates connected to company id 2
  await prisma.productcertificate.deleteMany({
    where: {
      connectedproduct: {
          companyid: 2
        }
    }
  })
  res.end("All deleted");
}

export const SendEmail = async(req, res) => {
  // send email from test mail now - change so it sends from visttorg and to the correct email
  const hostname = "smtp.gmail.com";
  const username = "mariavinna123@gmail.com"; 
  const password = "cxapowxvwkejbrzl"; // const password = "marraom123%";
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: hostname,
    auth: {
      user: username,
      pass: password,
    },
  });
  const info = await transporter.sendMail({
    from: "mariavinna123@gmail.com",
    to: "maria.omarsd99@gmail.com",
    subject: "Hello from node",
    text: "Hello world?",
    html: "<strong>Hello world?</strong>",
    headers: { 'x-myheader': 'test header' }
  });
  console.log("Message sent: %s", info.response);
  res.end("email sent")
}

const createdProductsWriteFile = async() => {
  // write product info of created products to file (and send an email to employee)
  fs.writeFile("createdProductsFile.txt", JSON.stringify(createdProducts))
}

const updatedProductsWriteFile = async() => {
  // write product info of updated products to file (and send an email to employee)
  fs.writeFile("updatedProductsFile.txt", JSON.stringify(updatedProducts))
}

const productsNoLongerComingInWriteFile = async(nolonger) => {
  // write product info of products no longer coming into the database (and send email to company)
  fs.writeFile("nolonger.txt", JSON.stringify(nolonger))
}

const productsNoLongerValidWriteFile = async() => {
  // write product info of products no longer coming into the database (and send email to company)
  fs.writeFile("notValidAnymore.txt", JSON.stringify(productsNotValid))
}

const DeleteAllSheetsProductCertificates = async(id) => {
  await prisma.productcertificate.deleteMany({
    where: {
      connectedproduct: {
          companyid: 2
      },
      productid : id 
    }
  })
}

const DeleteProduct = async(product) => {
  await prisma.product.delete({
    where: {
      productid: product.productid
    }
  })
}

// gets all products from online sheets file
const getProducts = () => {
  const options = {
    apiKey: 'AIzaSyAZQk1HLOZhbbIf6DruJMqsK-CBuRPr7Eg',
    sheetId: '1xyt08puk_-Ox2s-oZESp6iO1sCK8OAQsK1Z9GaovfqQ',
    returnAllResults: false,
  };

  reader(options, (results: allResults) => {
    const allprod : Array<result> = [];
    for (var i=1; i< results.length; i++) {
      var temp_prod : result = {
            id: results[i].nr,
            prodName: results[i].name,
            longDescription: results[i].long,
            shortDescription: results[i].short,
            fl: results[i].fl,
            prodImage: results[i].pic,
            url: results[i].link,
            brand: results[i].mark,
            fscUrl: results[i].fsclink,
            epdUrl: results[i].epdlink,
            vocUrl: results[i].voclink,
            ceUrl: results[i].ce,
            certificates: [{ name: "fsc", val: results[i].fsc },
                { name: "epd", val: results[i].epd },
                { name: "voc", val: results[i].voc },
                { name: "sv_allowed", val: results[i].sv },
                { name: "sv", val: results[i].svans },
                { name: "breeam", val: results[i].breeam },
                { name: "blengill", val: results[i].blue },
                { name: "ev", val: results[i].ev },
                { name: "ce", val: "TRUE" }
            ]
          }
          allprod.push(temp_prod)
    }
    // process for database
    ProcessForDatabase(allprod);
  });
}

const CreateProductCertificates = async(product : result, valid : Array<validDateObj>, productValidatedCertificates: Array<Certificate>) => {
  let certificateObjectList = [];
  await Promise.all(productValidatedCertificates.map(async (certificate : Certificate) => {
    if(certificate.name === 'EPD'){
      //TODO -> TÉKKA HVORT CONNECTEDPRODUCT = NULL VIRKI EKKI ÖRUGGLEGA RÉTT
      var date = null;
      if(valid[0].message === "Valid") {
        date = valid[0].date
      }
      console.log("valid date", date)
      return await prisma.productcertificate.create({
        data: {
          certificate : {
            connect : { id : 1 }
          },
          connectedproduct : {
            connect : { productid : product.id },
          },
          fileurl : product.epdUrl,
          validDate : date
        }
      }).then((prodcert) => {
        const obj = { id : prodcert.id }
        certificateObjectList.push(obj)
      })
    }

    if(certificate.name === 'FSC'){
      var date = null;
      if(valid[1].message === "Valid") {
        date = valid[1].date
      }
      return await prisma.productcertificate.create({
        data: {
          certificate : {
            connect : { id : 2 }
          },
          connectedproduct : {
            connect : { productid : product.id },
          },
          fileurl : product.fscUrl,
          validDate : date
        }
      }).then((prodcert) => {
        const obj = { id : prodcert.id }
        certificateObjectList.push(obj)
      })
    }

    if(certificate.name === 'VOC'){
      var date = null;
      if(valid[2].message === "Valid") {
        date = valid[2].date
      }
      return await prisma.productcertificate.create({
        data: {
          certificate : {
            connect : { id : 3 }
          },
          connectedproduct : {
            connect : { productid : product.id },
          },
          fileurl : product.vocUrl,
          validDate : date
        }
      }).then((prodcert) => {
        const obj = { id : prodcert.id }
        certificateObjectList.push(obj)
      })
    }

    if(certificate.name === 'SV'){
      return await prisma.productcertificate.create({
        data: {
          certificate : {
            connect : { id : 4 }
          },
          connectedproduct : {
            connect : { productid : product.id },
          }
        }
      }).then((prodcert) => {
        const obj = { id : prodcert.id }
        certificateObjectList.push(obj)
      })
    }

    if(certificate.name === 'SV_ALLOWED'){
      return await prisma.productcertificate.create({
        data: {
          certificate : {
            connect : { id : 5 }
          },
          connectedproduct : {
            connect : { productid : product.id },
          }
        }
      }).then((prodcert) => {
        const obj = { id : prodcert.id }
        certificateObjectList.push(obj)
      })
    }

    if(certificate.name === 'BREEAM'){
      return await prisma.productcertificate.create({
        data: {
          certificate : {
            connect : { id : 6 }
          },
          connectedproduct : {
            connect : { productid : product.id },
          }
        }
      }).then((prodcert) => {
        const obj = { id : prodcert.id }
        certificateObjectList.push(obj)
      })
    }
    if(certificate.name === 'BLENGILL'){
      return await prisma.productcertificate.create({
        data: {
          certificate : {
            connect : { id : 7 }
          },
          connectedproduct : {
            connect : { productid : product.id },
          }
        }
      }).then((prodcert) => {
        const obj = { id : prodcert.id }
        certificateObjectList.push(obj)
      })
    }
    if(certificate.name === 'EV'){
      return await prisma.productcertificate.create({
        data: {
          certificate : {
            connect : { id : 8 }
          },
          connectedproduct : {
            connect : { productid : product.id },
          }
        }
      }).then((prodcert) => {
        const obj = { id : prodcert.id }
        certificateObjectList.push(obj)
      })
    }
    if(certificate.name === 'CE'){
      return await prisma.productcertificate.create({
        data: {
          certificate : {
            connect : { id : 9 }
          },
          connectedproduct : {
            connect : { productid : product.id },
          }
        }
      }).then((prodcert) => {
        const obj = { id : prodcert.id }
        certificateObjectList.push(obj)
      })
    }
  })).then(() => {
    
  })
  return certificateObjectList
}

const check = ((parsedate : Date) => {
  // check if data extracted from pdf files is valid or not
  if (parsedate > new Date()) {
    return {message: "Valid", date: parsedate}
  }
  else if(parsedate.toString() == "Invalid Date"){
    return {message: "Invalid Date"}
  }
  else {
    return {message: "Expired Date"}
  }
})

const test = async() => {
  Promise.all(
    download("https://byko.is/Files/Files/PDF%20skjol/BREEAM/FSC_certificate_valid_to_31.05.2024.pdf", "dist", function(err){
      if(err) throw err
    })
  ).catch((err) => {
    console.error('FAILED', err)
  })
}

const ValidDate = async(validatedCertificates : Array<Certificate>, product : result) => {
  var arr = new Array<validDateObj>(3)
  await Promise.all(validatedCertificates.map(async(cert) => {
    if (cert.name === "EPD") {
      await Promise.all(
        download(product.epdUrl, "dist", function(err){
          if(err) throw err
        })
      ).catch((err) => {
        // console.error('Failed', err)
      })
      const url = product.epdUrl.split("/").pop()
      let dataBuffer = fs.readFileSync('dist/' + url); //dist/Sikasil-C%20EPD.pdf
      await pdf(dataBuffer).then(async function(data) {
        const filedate = data.text.split("\n").filter(text=> text.includes("Valid to"))[0].replace("Valid to", ""); 
        const parsedate = new Date(filedate)
        const test = check(parsedate)
        arr[0] = test
      })
    }
    if (cert.name === "FSC") {
      await Promise.all(
        download(product.fscUrl, "dist", function(err){
          if(err) throw err
        })
      ).catch((err) => {
        // console.error('Failed', err)
      })
      const url = product.fscUrl.split("/").pop()
      let dataBuffer = fs.readFileSync('dist/' + url); // dist/FSC_certificate_valid_to_31.05.2024.pdf
      await pdf(dataBuffer).then(async function(data) {
        const filedate = data.text.split("\n").filter(text=> text.includes("valid"))[1].split(" ").at(-1).split("-");
        const swap = ([item0, item1, rest]) => [item1, item0, rest]; 
        const newdate = swap(filedate).join("-")
        const parsedate = new Date(newdate)
        const test = check(parsedate)
        arr[1] = test
      })
    }
    if (cert.name === "VOC") {
      await Promise.all(
        download(product.vocUrl, "dist", function(err){
          if(err) throw err
        })
      ).catch((err) => {
        // console.error('Failed', err)
      })
      const url = product.vocUrl.split("/").pop()
      let dataBuffer = fs.readFileSync('dist/' + url); // dist/Soudabond%20Easy%20-%20EMICODE-Lizenz%203879%20-%202.8.17-e.pdf
      await pdf(dataBuffer).then(async function(data) {
        const filedate = data.text.split("\n").filter(text=> text.includes("valid until"))[0].replace("valid until", '')
        const parsedate = new Date(filedate)
        const test = check(parsedate)
        arr[2] = test
      })
    }
  }))
  return arr
}

const UpsertProductInDatabase = async(product : result, approved : boolean, create : boolean, certChange : boolean) => {
  //delete all productcertificates so they wont be duplicated and so they are up to date
  DeleteAllSheetsProductCertificates(product.id)

  // get all product certificates from sheets
  const convertedCertificates: Array<Certificate> = product.certificates.map(certificate => { if(certificate.val=="TRUE") {return {name: certificate.name.toUpperCase() }} })
  Object.keys(convertedCertificates).forEach(key => convertedCertificates[key] === undefined && delete convertedCertificates[key]);
  const validatedCertificates = CertificateValidator({ certificates: convertedCertificates, fscUrl: product.fscUrl, epdUrl: product.epdUrl, vocUrl: product.vocUrl, ceUrl: product.ceUrl })
  
  if(validatedCertificates.length === 0){
    // no valid certificates for this product
    productsNotValid.push(product)
    return;
  }
  if(create === true) {
    if (validatedCertificates.length !== 0) {
      createdProducts.push(product)
      // check valid date when product is created
      var ble = await ValidDate(validatedCertificates, product)
    }
  }
  if(certChange === true) {
    if(validatedCertificates.length !== 0 ) {
      updatedProducts.push(product)
      // check valid date when the certificates have changed
      var ble = await ValidDate(validatedCertificates, product)
    }
  }

  // var ble = await ValidDate(validatedCertificates, product)

  await prisma.product.upsert({
    where: {
      productid : product.id
    },
    update: {
      approved: approved,
      title: product.prodName,
      productid : product.id,
      sellingcompany: {
        connect: { id : 2}
      },
      categories : {
        connect: { name : product.fl}
      },
      description : product.longDescription,
      shortdescription : product.shortDescription,
      productimageurl : product.prodImage,
      url : product.url,
      brand : product.brand,
      updatedAt: new Date()
    },
    create: {
      // approved: approved,
      title: product.prodName,
      productid : product.id,
      sellingcompany: {
        connect: { id : 2}
      },
      categories : {
        connect: { name : product.fl}
      },
      description : product.longDescription,
      shortdescription : product.shortDescription,
      productimageurl : product.prodImage,
      url : product.url,
      brand : product.brand,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  await CreateProductCertificates(product, ble, validatedCertificates)
}

// check if product list database has any products that are not coming from sheets anymore
const isProductListFound = async(products : Array<result>) => {
  // get all current products from this company
  const currprods = await prisma.product.findMany({
      where : {companyid : 2}
  })
  const nolonger = currprods.map((curr_prod) => {
    const match = products.map((prod) => {
      if(curr_prod.productid == prod.id) {
        return true
      }
    })
    if(!match.includes(true)) {
      return curr_prod
    }
  }).filter(item=>item!==undefined)
  productsNoLongerComingInWriteFile(nolonger)
  // deleta prodcut from prisma database
  nolonger.map(product => {
    DeleteProduct(product)
  })
}

const ProcessForDatabase = async(products : Array<result>) => {
  // check if product is in database but not coming in from company anymore
  isProductListFound(products)

  for(var i = 0; i < products.length; i++) {
    const prod = await prisma.product.findUnique({
        where : {productid: products[i].id},
        include : {certificates: {
            include: {
              certificate : true
            }
          }}
    })
    var approved = null;
    if(prod !== null) {
      approved = prod.approved;
      var certChange : boolean = false;
      for (var x = 0; x < prod.certificates.length; x++) {
         // epd file url is not the same
        if (prod.certificates[x].certificateid == 1) {
          if(prod.certificates[x].fileurl !== products[i].epdUrl) {
              certChange = true;
              approved = false;
          }
        }
        if (prod.certificates[x].certificateid == 2) {
          // fsc file url is not the same
          if(prod.certificates[x].fileurl !== products[i].fscUrl) {
              certChange = true;
              approved = false;
          }
        }
        if (prod.certificates[x].certificateid == 3) {
          // voc file url is not the same
          if(prod.certificates[x].fileurl !== products[i].vocUrl) {
              certChange = true;
              approved = false;
          }
        }
      }
    }
    // no product found --> create it
    else {
      var create = true;
    }
    // UpsertProductInDatabase(products[i], approved, create, certChange)
    test()
  }
}