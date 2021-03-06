import { PrismaClient } from '@prisma/client'
import certificates from '../../mappers/certificates';
import BykoCategoryMapper from '../mappers/categories/byko'
const reader = require('g-sheets-api');
const fs = require('file-system');
import { Certificate } from '../types/models'
import { CertificateValidator } from '../helpers/CertificateValidator'

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
    ]
}

interface allResults {
    obj: Array<result>,
    length: number
}

export const InsertAllSheetsProducts = async(req,res) => {
    // get all data from sheets file
    getProducts();
    res.end('All products inserted')
}

export const DeleteAllSheetsProducts = async(req,res) => {
    await prisma.product.deleteMany({
      where: {
        companyid: 2
      }
    })
    res.end("All deleted");
}

export const DeleteAllSheetsCert = async(req,res) => {
    await prisma.productcertificate.deleteMany({
      where: {
        connectedproduct: {
            companyid: 2
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
            companyid: 2
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
                            { name: "ev", val: results[i].ev }
                        ]
                    }
                allprod.push(temp_prod)
            // check if product is in the database or not
        }
        // process for database
        processForDatabase(allprod);
    });
}


const CreateProductCertificates = async(product : result, productValidatedCertificates: Array<Certificate>) => {
    let certificateObjectList = [];
    await Promise.all(productValidatedCertificates.map(async (certificate : Certificate) => {
        // console.log('certificite name', certificate.name)
      if(certificate.name === 'EPD'){
        //TODO -> T??KKA HVORT CONNECTEDPRODUCT = NULL VIRKI EKKI ??RUGGLEGA R??TT
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
    console.log('certificates for prod', convertedCertificates)
    const validatedCertificates = CertificateValidator({ certificates: convertedCertificates, fscUrl: product.fscUrl, epdUrl: product.epdUrl, vocUrl: product.vocUrl })
    console.log('valid certificates for prod', validatedCertificates)
    if(validatedCertificates.length === 0){
        // no valid certificates so send email to notify company
        productsNoLongerValid(product)
        return;
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
          createdAt: new Date() // updatedAt l??ka h??r held a?? begga hafi gert ??a??
        }
      })
    
    await CreateProductCertificates(product, validatedCertificates)
}

// check if product list database has any products that are not coming from sheets anymore
const isProductListFound = async(products : Array<result>) => {
    // get all current products from this company
    const currprods = await prisma.product.findMany({
        where : {companyid : 2}
    })

    var nolonger = [];

    for(var i = 0; i < currprods.length; i++) {
        var fann = false;
        for(var x=0; x< products.length; x++) {
            if (currprods[i].productid == products[x].id) {
                // console.log("inni")
                fann = true;
                break
            }
        }
        if (fann == false) {
            console.log("ekki inni")
            nolonger.push(currprods[i])
        }
    }
    productsNoLongerComingInFile(nolonger)
}

const processForDatabase = async(products : Array<result>) => {
    // check if product is in database but not coming in from company anymore
    isProductListFound(products)

    var created : Array<object> = [];
    var updated : Array<object> = [];
    // products.map(async(product) => {const prod = await prisma.product.findFirst({
    //     where: {productid: product.id },
    //     include: {
    //       certificates: {
    //         include: {
    //           certificate : true
    //         }
    //       }
    //     // certificates: true
    //     },
    //   });
    //   console.log('product', prod)
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
        // var approved : boolean = prod.approved; --> breyta ??essu, ??a?? er null stundum n??na
        var approved : boolean = true;
        if(prod !== null) {
            console.log("FOUND PRODUCT")
            // check what changed in the product
            // console.log("prod", prod);
            // console.log("products[i]", products[i])
            var certChange : Boolean = false;
            for (var x = 0; x < prod.certificates.length; x++) {
                // console.log("prod cert id ", prod.certificates[x].certificateid)
                if (prod.certificates[x].certificateid == 1) {
                    if(prod.certificates[x].fileurl !== products[i].epdUrl) {
                        console.log("EPD er ekki eins")
                        certChange = true;
                        approved = false;
                    }
                }
                if (prod.certificates[x].certificateid == 2) {
                    if(prod.certificates[x].fileurl !== products[i].fscUrl) {
                        console.log("FSC er ekki eins")
                        certChange = true;
                        approved = false;
                    }
                }
                if (prod.certificates[x].certificateid == 3) {
                    if(prod.certificates[x].fileurl !== products[i].vocUrl) {
                        console.log("VOC er ekki eins")
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
            // ss create-a v??runa og b??a til skjal til a?? senda ?? starfsmann
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
    



// new prod {
//   nr: 'V??run??mer',
//   name: 'Nafn',
//   long: 'L??ng l??sing',
//   short: 'Stutt l??sing',
//   fl: 'Flokkar',
//   link: 'Sl???? ?? v??ru ?? vef (ef til sta??ar)',
//   mark: 'V??rumerki',
//   pic: 'Sl???? ?? mynd af v??ru',
//   fsc: 'FSC vottun',
//   epd: 'EPD vottun',
//   epdlink: 'Sl???? ?? EPD skjal',
//   voc: 'VOC vottun',
//   voclink: 'Sl???? ?? VOC skjal',
//   sv: 'Leyfilegt ?? svansvotta?? h??s',
//   svans: 'Svansvottun',
//   breeam: 'BREEAM vottun',
//   blue: 'Bl??i engilinn',
//   ev: 'Evr??publ??mi??'
// }
