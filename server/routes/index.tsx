import express from "express";
import axios from 'axios'
import { PrismaClient } from '@prisma/client'
import { BykoCertificate, BykoProduct, BykoResponseData } from '../../types/byko'
import { ProductProps } from '../../types/products'
import { ProductCertificate } from '../../types/certificates'
import app from "next/app";
import { resolve } from "path";

const router = express.Router();
const prisma = new PrismaClient()
const BykoAPI = "https://byko.is/umhverfisvottadar?password=cert4env"


//COMPANY ID IN DATABASE IS 1

function routes(app : any) {

  app.get("/api/byko", async(req : any, res : any) => {
    //Todo connect to byko controller and do stuff there
    const bykoData : BykoResponseData = await requestBykoApi(1);
    await ProcessForDatabase(bykoData)
    if(bykoData.totalPageCount > 1){
      for(var i = 0; i < bykoData.totalPageCount; i++){
        const moreData = await requestBykoApi(i+2)
        await ProcessForDatabase(moreData)
      }
    }

    res.end("We made it! And it's great");
  });

  app.get('/api/byko/deleteallproducts', async(req: any, res: any) => {
    await prisma.product.deleteMany({})
    res.end("All deleted");
  });


  app.get('/api/byko/deleteallcategories', async(req: any, res: any) => {
    await prisma.category.deleteMany({})
    res.end("All deleted");
  });

  app.get('/api/byko/deleteallproductcertificates', async(req: any, res: any) => {
    await prisma.productcertificate.deleteMany({})
    res.end("All deleted");
  });
  
  return router;
};  


async function requestBykoApi(pageNr : number){
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
      return await prisma.productcertificate.create({
        data: {
          certificate : {
            connect : { id : 1 }
          },
          connectedproduct : null,
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
          connectedproduct : null,
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
          connectedproduct : null,
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

const UpsertProductInDatabase = async(product : BykoProduct) => {

  const hasAnyCertificate = product.certificates.filter(x => x.cert == 'EPD').length > 0 && product.epdUrl != "" ||  product.certificates.filter(x => x.cert == 'FSC').length > 0 && product.fscUrl != "" ||  product.certificates.filter(x => x.cert == 'VOC').length > 0 && product.vocUrl != "";
  
  if(!hasAnyCertificate){
    return;
  }

  let certificateObjectList = await CreateProductCertificates(product)
  
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
        connect: [
          {
            name: 'Annað'
          }
        ]
      },
      certificates : {
        connect : certificateObjectList
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
        connect: [
          {
            name: 'Annað'
          }
        ]
      },
      certificates : {
        connect : certificateObjectList
      },
      description : product.longDescription,
      shortdescription : product.shortDescription,
      productimageurl : `https://byko.is/${product.prodImage}`,
      url : product.url,
      brand : product.brand
    },
  })
 
}

module.exports = routes;