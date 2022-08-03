const reader = require('g-sheets-api');
const fs = require('file-system');
import { Certificate } from '../types/models'
import { CertificateValidator } from '../helpers/CertificateValidator'
import { TestControllerProduct, allProducts, validDateObj } from '../types/testResult'
import { SendEmail } from '../helpers/SendEmail'
import { ValidDate } from '../helpers/ValidDate'
import { WriteFile } from '../helpers/WriteFile'
import { CreateProductCertificates } from '../helpers/CreateProductCertificates'
// import { prismaInstance } from '../../lib/prisma';
import { DeleteAllProductsByCompany,
        DeleteAllCertByCompany,
        DeleteProduct, 
        DeleteProductCertificates,
        UpsertProduct,
        GetUniqueProduct,
        GetAllProductsByCompanyid } from '../helpers/PrismaHelper'

// company id 3, get data from google sheets and insert into database from Ebson

var updatedProducts = [];
var createdProducts = [];
var productsNotValid = [];

export const InsertAllSheetsProducts = async(req,res) => {
    // get all data from sheets file
    getProducts();
    res.end('All Ebson products inserted')
}

export const DeleteAllSheetsProducts = async(req,res) => {
  DeleteAllProductsByCompany(3)
  res.end("All Ebson products deleted");
}

export const DeleteAllSheetsCert = async(req,res) => {
  DeleteAllCertByCompany(3)
  res.end("All Ebson product certificates deleted");
}

const WriteAllFiles = async() => {
  if (createdProducts.length > 0) {
    WriteFile("EbsonCreated", createdProducts);
  }
  if (updatedProducts.length > 0) {
    WriteFile("EbsonUpdated", updatedProducts);
  }
  if (productsNotValid.length > 0) {
    WriteFile("EbsonNotValid", productsNotValid);
  }
}

const productsNoLongerComingInWriteFile = async(nolonger) => {
  // write product info of products no longer coming into the database (and send email to company)
  fs.writeFile("writefiles/nolonger.txt", JSON.stringify(nolonger))
  // SendEmail("Products no longer coming in from company")
}

// gets all products from online sheets file
const getProducts = () => {
  const options = {
    apiKey: 'AIzaSyAZQk1HLOZhbbIf6DruJMqsK-CBuRPr7Eg', //google api key in testProject console
    sheetId: '1SFHaI8ZqPUrQU3LLgCsrLBUtk4vzyl6_FQ02nm6XehI',
    returnAllResults: false,
  };

  reader(options, (results: allProducts) => {
    const allprod : Array<TestControllerProduct> = [];
    for (var i=1; i< results.length; i++) {
      var temp_prod : TestControllerProduct = {
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
          certificates: [
              {name: "fsc", val: results[i].fsc },
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

const UpsertProductInDatabase = async(product : TestControllerProduct, approved : boolean, create : boolean, certChange : boolean) => {
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
      var validDate = await ValidDate(validatedCertificates, product)
    }
  }
  if(certChange === true) {
    //delete all productcertificates so they wont be duplicated and so they are up to date
    DeleteProductCertificates(product.id)
    if(validatedCertificates.length !== 0 ) {
      updatedProducts.push(product)
      // check valid date when the certificates have changed
      var validDate = await ValidDate(validatedCertificates, product)
    }
  }
  // update or create product in database
  await UpsertProduct(product, approved, 3)
  if(certChange === true || create === true) {
    await CreateProductCertificates(product, validDate, validatedCertificates)
  }
}

// check if product list database has any products that are not coming from sheets anymore
const isProductListFound = async(products : Array<TestControllerProduct>) => {
  // get all current products from this company
  const currprods = await GetAllProductsByCompanyid(3)
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
    DeleteProduct(product.productid)
  })
}

const ProcessForDatabase = async(products : Array<TestControllerProduct>) => {
  // check if product is in database but not coming in from company anymore
  isProductListFound(products)

  products.map(async(product) => {
    const prod = await GetUniqueProduct(product.id)
    var approved = null;
    if (prod !== null){
      approved = prod.approved;
      var certChange : boolean = false;
      prod.certificates.map((cert) => {
        if (cert.certificateid == 1) {
          // epd file url is not the same
          if(cert.fileurl !== product.epdUrl) {
            certChange = true;
            approved = false;
          }
        }
        if (cert.certificateid == 2) {
          // fsc file url is not the same
          if(cert.fileurl !== product.fscUrl) {
            certChange = true;
            approved = false;
          }
        }
        if (cert.certificateid == 3) {
          // voc file url is not the same
          if(cert.fileurl !== product.vocUrl) {
            certChange = true;
            approved = false;
          }
        }
      })
    }
    else {
      var create = true;
      var certChange = true;
    }
    UpsertProductInDatabase(product, approved, create, certChange)
  })
  // write all appropriate files
  WriteAllFiles()
}