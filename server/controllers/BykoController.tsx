import { PrismaClient } from '@prisma/client'
import { BykoCertificate, BykoProduct, BykoResponseData } from '../types/byko'
import axios from 'axios'
import fs from 'fs'
import BykoCategoryMapper from '../mappers/categories/byko'
import { CertificateValidator } from '../helpers/CertificateValidator'
import { Certificate } from '../types/Models'
import BykoCertificateMapper from '../mappers/certificates/byko'

const prisma = new PrismaClient()
const BykoAPI = "https://byko.is/umhverfisvottadar?password=cert4env"

const mockProduct = {
  id: '200907',
  axId: '',
  retailer: 'BYKO',
  brand: 'Önnur vörumerki',
  prodName: 'Burðarviður 45x95 mm',
  shortDescription: 'Heflað timbur',
  longDescription: 'Burðarviður styrkflokkur C24.',
  metaTitle: 'Styrkleiksflokkað timbur',
  metaKeywords: '',
  prodTypeParent: 'Timbur',
  prodType: 'Burðarviður',
  groupId: 235017,
  groupName: 'Timbur',
  url: 'https://byko.is/leit/vara?ProductID=200907',
  prodImage: '/Admin/Public/GetImage.ashx?width=400&height=400&crop=5&Compression=75&DoNotUpscale=true&image=/Files/Images/Products/200907___0_fullsize.jpg',
  fscUrl: 'https://byko.is/Files/Files/PDF%20skjol/BREEAM/FSC_certificate_valid_to_31.05.2024.pdf',
  epdUrl: '',
  vocUrl: '',
  certificates: [
    { cert: 'FSC' },
    { cert: 'Leyfilegt í svansvottað hús' },
    { cert: 'BREEAM' }
  ]
}

export const InsertAllBykoProducts = async(req, res) => {
  const bykoData : BykoResponseData = await requestBykoApi(1);

  //delete all productcertificates so they wont be duplicated and so they are up to date
  //TODO - only delete byko productCertificates
  await prisma.productcertificate.deleteMany({})
  
  //process all data and insert into database
  await ProcessForDatabase(bykoData)
  
  //if the json from byko has multiple pages, make sure to call all the pages to get all the products
  if(bykoData.totalPageCount > 1){
    for(var i = 0; i < bykoData.totalPageCount; i++){
      const moreData = await requestBykoApi(i+2)
      await ProcessForDatabase(moreData)
    }
  }
  //TODO return success status
  return res.end("We made it! And it's great");
};

export const TestProduct = async(req, res) => {
  await UpsertProductInDatabase(mockProduct)
  return res.end('WHOOP')
}

export const GetAllCategories = async(req,res) => {
  const bykoData : BykoResponseData = await requestBykoApi(1);
  await ListCategories(bykoData)
  //TODO return categories
  res.end("All done");
}

export const DeleteAllProducts = async(req,res) => {
  await prisma.product.deleteMany({})
  //TODO - only delete byko products
  res.end("All deleted");
}

export const DeleteAllCategories = async(req, res) => {
  await prisma.category.deleteMany({})
  //TOOD - only delete byko categories
  res.end("All deleted");
}

export const DeleteAllProducCertificates = async(req,res) => {
  //TODO - Only delete byko product certificates
  await prisma.productcertificate.deleteMany({})
  res.end("All deleted");
}

const requestBykoApi = async(pageNr : number) => {
  return axios.get(`${BykoAPI}&PageNum=${pageNr}`).then(response => {
    if (response.status === 200) {
      const data : BykoResponseData = response.data;
      return data;
    }else{
      console.log(`Error occured : ${response.status} - ${response.statusText}`);
    } 
  });
}

const ProcessForDatabase = async(data : BykoResponseData) => {
  for(var i = 0; i < data.productList.length; i++){
    //here is a single product
    await UpsertProductInDatabase(data.productList[i])
  }
  // for(var i = 0; i < 100; i++){
  //   await UpsertProductInDatabase(data[i])
  // }
}

//PRODUCT CERTIFICATE ID'S
// EPD = 1
// FSC = 2
// VOC = 3
// SV = 4
// SV_ALLOWED = 5
// BREEAM = 6
const CreateProductCertificates = async(product : BykoProduct, productValidatedCertificates: Array<Certificate>) => {
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
            connect : { productid : product.axId },
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
            connect : { productid : product.axId },
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
            connect : { productid : product.axId },
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
            connect : { productid : product.axId },
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
            connect : { productid : product.axId },
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
            connect : { productid : product.axId },
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

const ListCategories = async(data : BykoResponseData) => {
  const filteredProdType = data.productList.filter(product => product.prodTypeParent != 'Fatnaður')
  const prodtypelist = filteredProdType.map(product => product.prodType)

  //Ferðavörur,Útileguvörur,Fatnaður

  const parentprodtypelist = filteredProdType.map(product => product.prodTypeParent)
  const uniqueArrayProdType = prodtypelist.filter(function(item, pos) {
    return prodtypelist.indexOf(item) == pos
  })
  const uniqueArrayParentProdType = parentprodtypelist.filter(function(item, pos) {
    return parentprodtypelist.indexOf(item) == pos;
  })
  fs.writeFile('prodtypes.txt', uniqueArrayProdType.toString(), function(err) {
    if(err){
      return console.log(err)
    }
    console.log("success")
  })
  fs.writeFile('parentprodtypes.txt', uniqueArrayParentProdType.toString(), function(err) {
    if(err){
      return console.log(err)
    }
    console.log("success")
  })

}

interface ConnectedCategory {
  name: string
}

const getMappedCategory = (category: string) => {
  const matchedCategory: Array<ConnectedCategory> = []
  const categoryList: Array<string> = category.split(';')
  return new Promise((resolve : (value: Array<ConnectedCategory>) => void, reject) => {
    for (const cat in BykoCategoryMapper) {
      for(const productCategory in categoryList){
        if(BykoCategoryMapper[cat].includes(categoryList[productCategory])){
          matchedCategory.push({name: cat})
        }
      }
    }
    resolve(matchedCategory)
  })
}

const UpsertProductInDatabase = async(product : BykoProduct) => {

  //Map certificates and validate them before adding to database
  const convertedCertificates: Array<Certificate> = product.certificates.map(certificate => { return {name: BykoCertificateMapper[certificate.cert]} })
  const validatedCertificates = CertificateValidator({ certificates: convertedCertificates, fscUrl: product.fscUrl, epdUrl: product.epdUrl, vocUrl: product.vocUrl })
  
  //If there are not valid certificates on the product, then it should not be in the database
  if(validatedCertificates.length === 0){
    return;
  }

  //map the product category to vistbóks category dictionary
  const mappedCategory: Array<ConnectedCategory> = []
  const prodTypeParentCategories = await getMappedCategory(product.prodTypeParent)
  const prodTypeCategories = await getMappedCategory(product.prodType)
  prodTypeCategories.map(cat => mappedCategory.push(cat))
  prodTypeParentCategories.map(cat => mappedCategory.push(cat))
  
  //Product needs to fit into at least one of our allowed categories
  if(mappedCategory.length > 0){
    //add or edit the product in the database
    await prisma.product.upsert({
      where: {
        productid : product.axId
      },
      update: {
        title: product.prodName,
        productid : product.axId,
        sellingcompany: {
          connect: { id : 1}
        },
        categories : {
          connect: mappedCategory
        },
        description : product.longDescription,
        shortdescription : product.shortDescription,
        productimageurl : `https://byko.is/${product.prodImage}`,
        url : product.url,
        brand : product.brand
      },
      create: {
        title: product.prodName,
        productid : product.axId,
        sellingcompany: {
          connect: { id : 1}
        },
        categories : {
          connect: mappedCategory
        },
        description : product.longDescription,
        shortdescription : product.shortDescription,
        productimageurl : `https://byko.is/${product.prodImage}`,
        url : product.url,
        brand : product.brand
      }
    })

    //create the product certificates for this specific product
    await CreateProductCertificates(product, validatedCertificates)
  }
}