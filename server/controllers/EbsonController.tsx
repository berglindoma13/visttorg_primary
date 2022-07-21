import { PrismaClient } from '@prisma/client'
const reader = require('g-sheets-api');
const fs = require('file-system');
import { Certificate } from '../types/models'
import { CertificateValidator } from '../helpers/CertificateValidator'
import { TestControllerProduct, allProducts, validDateObj } from '../types/testResult'
import { SendEmail } from '../helpers/SendEmail'
import { ValidDate } from '../helpers/ValidDate'
// import { CreateProductCertificates } from '../helpers/CreateProductCertificates'

const prisma = new PrismaClient()

// company id 3, get data from google sheets and insert into database from Ebson

var updatedProducts = [];
var createdProducts = [];
var productsNotValid = [];

export const InsertAllSheetsProducts = async(req,res) => {
    // get all data from sheets file
    getProducts();
    // write all appropriate files
    createdProductsWriteFile();
    updatedProductsWriteFile();
    productsNoLongerValidWriteFile();
    res.end('All Ebson products inserted')
}

export const DeleteAllSheetsProducts = async(req,res) => {
  await prisma.product.deleteMany({
    where: {
      companyid: 3
    }
  })
  res.end("All Ebson products deleted");
}

export const DeleteAllSheetsCert = async(req,res) => {
  await prisma.productcertificate.deleteMany({
    where: {
      connectedproduct: {
        companyid: 3
      }
    }
  })
  res.end("All deleted");
}

const createdProductsWriteFile = async() => {
  // write product info of created products to file (and send an email to employee)
  fs.writeFile("createdProductsFile.txt", JSON.stringify(createdProducts))
  // SendEmail("Created products")
}

const updatedProductsWriteFile = async() => {
  // write product info of updated products to file (and send an email to employee)
  fs.writeFile("updatedProductsFile.txt", JSON.stringify(updatedProducts))
  // SendEmail("Updated products")
}

const productsNoLongerComingInWriteFile = async(nolonger) => {
  // write product info of products no longer coming into the database (and send email to company)
  fs.writeFile("nolonger.txt", JSON.stringify(nolonger))
  // SendEmail("Products no longer coming in from company")
}

const productsNoLongerValidWriteFile = async() => {
  // write product info of products no longer coming into the database (and send email to company)
  fs.writeFile("notValidAnymore.txt", JSON.stringify(productsNotValid))
  // SendEmail("Products not valid anymore")
}

const DeleteAllSheetsProductCertificates = async(id) => {
    await prisma.productcertificate.deleteMany({
      where: {
        connectedproduct: {
            companyid: 3
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

const CreateProductCertificates = async(product : TestControllerProduct, validDateCertificates : Array<validDateObj>, productValidatedCertificates: Array<Certificate>) => {
  let certificateObjectList = [];
  await Promise.all(productValidatedCertificates.map(async (certificate : Certificate) => {
    if(certificate.name === 'EPD'){
      //TODO -> TÉKKA HVORT CONNECTEDPRODUCT = NULL VIRKI EKKI ÖRUGGLEGA RÉTT
      var date = null;
      if(validDateCertificates[0].message === "Valid") {
        date = validDateCertificates[0].date
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
      if(validDateCertificates[1].message === "Valid") {
        date = validDateCertificates[1].date
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
      if(validDateCertificates[2].message === "Valid") {
        date = validDateCertificates[2].date
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

const UpsertProductInDatabase = async(product : TestControllerProduct, approved : boolean, create : boolean, certChange : boolean) => {
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

  await prisma.product.upsert({
    where: {
      productid : product.id
    },
    update: {
      approved: approved,
      title: product.prodName,
      productid : product.id,
      sellingcompany: {
        connect: { id : 3}
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
        connect: { id : 3}
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
const isProductListFound = async(products : Array<TestControllerProduct>) => {
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

const ProcessForDatabase = async(products : Array<TestControllerProduct>) => {
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
    UpsertProductInDatabase(products[i], approved, create, certChange)
  }
}