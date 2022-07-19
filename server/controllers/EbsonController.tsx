import { PrismaClient } from '@prisma/client'
const reader = require('g-sheets-api');
const fs = require('file-system');
import { Certificate } from '../types/models'
import { CertificateValidator } from '../helpers/CertificateValidator'
import { ValidDate } from '../helpers/ValidDate'

const prisma = new PrismaClient()

// company id 3, get data from google sheets and insert into database from Ebson

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

export const InsertAllSheetsProducts = async(req,res) => {
    // get all data from sheets file
    getProducts();
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

const createdProductsFile = async(product : Array<object>) => {
    // write product info of created products to file (and send an email to employee)
    fs.writeFile("createdProductsFile.txt", JSON.stringify(product))
}

const updatedProductsFile = async(product : Array<object>) => {
    // write product info of updated products to file (and send an email to employee)
    fs.writeFile("updatedProductsFile.txt", JSON.stringify(product))
}

const productsNoLongerComingInFile = async(nolonger) => {
    // write product info of products no longer coming into the database (and send email to company)
    fs.writeFile("nolonger.txt", JSON.stringify(nolonger))
}

const productsNoLongerValid = async(notValid) => {
    // write product info of products no longer coming into the database (and send email to company)
    fs.writeFile("notValidAnymore.txt", JSON.stringify(notValid))
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
    // res.end("All sheets product certificates deleted");
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
            var temp_prod : result = {id: results[i].nr,
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
            // check if product is in the database or not
        }
        // process for database
        ProcessForDatabase(allprod);
    });
}

const CreateProductCertificates = async(product : result, productValidatedCertificates: Array<Certificate>) => {
    let certificateObjectList = [];
    await Promise.all(productValidatedCertificates.map(async (certificate : Certificate) => {
      if(certificate.name === 'EPD'){
        //TODO -> TÉKKA HVORT CONNECTEDPRODUCT = NULL VIRKI EKKI ÖRUGGLEGA RÉTT
        return await prisma.productcertificate.create({
          data: {
            certificate : {
              connect : { id : 1 }
            },
            connectedproduct : {
              connect : { productid : product.id },
            },
            fileurl : product.epdUrl
          }
        }).then((prodcert) => {
          const obj = { id : prodcert.id }
          certificateObjectList.push(obj)
        })
      }
  
      if(certificate.name === 'FSC'){
        return await prisma.productcertificate.create({
          data: {
            certificate : {
              connect : { id : 2 }
            },
            connectedproduct : {
              connect : { productid : product.id },
            },
            fileurl : product.fscUrl
          }
        }).then((prodcert) => {
          const obj = { id : prodcert.id }
          certificateObjectList.push(obj)
        })
      }
  
      if(certificate.name === 'VOC'){
        return await prisma.productcertificate.create({
          data: {
            certificate : {
              connect : { id : 3 }
            },
            connectedproduct : {
              connect : { productid : product.id },
            },
            fileurl : product.vocUrl
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

const UpsertProductInDatabase = async(product : result, approved : boolean) => {

    //delete all productcertificates so they wont be duplicated and so they are up to date
    DeleteAllSheetsProductCertificates(product.id)

    // get all product certificates from sheets
    const convertedCertificates: Array<Certificate> = product.certificates.map(certificate => { if(certificate.val=="TRUE") {return {name: certificate.name.toUpperCase() }} })
    Object.keys(convertedCertificates).forEach(key => convertedCertificates[key] === undefined && delete convertedCertificates[key]);
    const validatedCertificates = CertificateValidator({ certificates: convertedCertificates, fscUrl: product.fscUrl, epdUrl: product.epdUrl, vocUrl: product.vocUrl, ceUrl: product.ceUrl })
    if(validatedCertificates.length === 0){
        // no valid certificates so send email to notify company
        productsNoLongerValid(product)
        return;
    }

     validatedCertificates.map( (cert) => {
        if (cert.name === "EPD") {
            const ble = ValidDate({epdUrl: product.epdUrl})
        }
        if (cert.name === "FSC") {
            // bua til nytt valid date fall fyrir fsc
            // const ble = ValidDate({epdUrl: product.epdUrl})
        }
        if (cert.name === "VOC") {
            // bua til nytt valid date fall fyrir voc
            // const ble = ValidDate({epdUrl: product.epdUrl})
        }
    })

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
    
    await CreateProductCertificates(product, validatedCertificates)
}

// check if product list database has any products that are not coming from sheets anymore
const isProductListFound = async(products : Array<result>) => {
    // get all current products from this company
    const currprods = await prisma.product.findMany({
        where : {companyid : 3}
    })

    var nolonger = [];

    for(var i = 0; i < currprods.length; i++) {
        var found = false;
        for(var x=0; x< products.length; x++) {
            if (currprods[i].productid == products[x].id) {
                found = true;
                break
            }
        }
        if (found == false) {
            console.log("ekki inni")
            nolonger.push(currprods[i])
        }
    }
    productsNoLongerComingInFile(nolonger)
}

const ProcessForDatabase = async(products : Array<result>) => {
    // check if product is in database but not coming in from company anymore
    isProductListFound(products)

    var created : Array<object> = [];
    var updated : Array<object> = [];
    // products.map(async(product) => {
    //   const prod = await prisma.product.findUnique({
    //     where : {productid: products[i].id},
    //     include : {certificates: {
    //         include: {
    //           certificate : true
    //         }
    //       }}
    //   })
    //   var approved : boolean = true;

    // })
    for(var i = 0; i < products.length; i++) {
        const prod = await prisma.product.findUnique({
            where : {productid: products[i].id},
            include : {certificates: {
                include: {
                  certificate : true
                }
              }}
        })
        // var approved : boolean = prod.approved; --> breyta þessu, það er null stundum núna
        var approved : boolean = true;
        if(prod !== null) {
            console.log("FOUND PRODUCT")
            var certChange : Boolean = false;
            for (var x = 0; x < prod.certificates.length; x++) {
                if (prod.certificates[x].certificateid == 1) {
                    if(prod.certificates[x].fileurl !== products[i].epdUrl) {
                        certChange = true;
                        approved = false;
                    }
                }
                if (prod.certificates[x].certificateid == 2) {
                    if(prod.certificates[x].fileurl !== products[i].fscUrl) {
                        certChange = true;
                        approved = false;
                    }
                }
                if (prod.certificates[x].certificateid == 3) {
                    if(prod.certificates[x].fileurl !== products[i].vocUrl) {
                        certChange = true;
                        approved = false;
                    }
                }
            }
            if( certChange == true) {
                // certificates changed in the product
                console.log("certificates changed so push to updated file")
                // update file
                updated.push(prod) 
            }
        }
        else {
            // ss create-a vöruna og búa til skjal til að senda á starfsmann
            console.log("NO PRODUCT WITH THAT ID")
            // create file
            created.push(products[i])
        }
        UpsertProductInDatabase(products[i], approved)
        // write all info to correct files after checking all of the products
        if(updated.length>0) {
            updatedProductsFile(updated)
        }
        if(created.length>0) {
            createdProductsFile(created)
        }
    }
}