import { PrismaClient } from '@prisma/client'
import { BykoCertificate, BykoProduct, BykoResponseData } from '../../types/byko'
import axios from 'axios'
import fs from 'fs'
import BykoCategoryMapper from '../mappers/categories/byko'

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
  return res.end("We made it! And it's great");
};

export const TestProduct = async(req, res) => {
  await UpsertProductInDatabase(mockProduct)
  return res.end('WHOOP')
}

export const GetAllCategories = async(req,res) => {
  const bykoData : BykoResponseData = await requestBykoApi(1);
  await ListCategories(bykoData)
  res.end("All done");
}

export const DeleteAllProducts = async(req,res) => {
  await prisma.product.deleteMany({})
  res.end("All deleted");
}

export const DeleteAllCategories = async(req, res) => {
  await prisma.category.deleteMany({})
  res.end("All deleted");
}

export const DeleteAllProducCertificates = async(req,res) => {
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

const CreateProductCertificates = async(product : BykoProduct) => {
  let certificateObjectList = [];
  await Promise.all(product.certificates.map(async(certificate : BykoCertificate) => {
    if(certificate.cert === 'EPD' && product.epdUrl != ""){ //EPD is 1
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

    if(certificate.cert === 'FSC' && product.fscUrl != ""){ //FSC is 2
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

    if(certificate.cert === 'VOC' && product.vocUrl != ""){ //VOC is 3
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

  const hasAnyCertificate = product.certificates.filter(x => x.cert == 'EPD').length > 0 && product.epdUrl != "" ||  product.certificates.filter(x => x.cert == 'FSC').length > 0 && product.fscUrl != "" ||  product.certificates.filter(x => x.cert == 'VOC').length > 0 && product.vocUrl != "";
  
  if(!hasAnyCertificate){
    return;
  }

  const mappedCategory: Array<ConnectedCategory> = await getMappedCategory(product.prodTypeParent)
  console.log('mappedCategory', mappedCategory)
  
  if(mappedCategory.length > 0){
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
    await CreateProductCertificates(product)
  }
}