import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { Certificate } from '../types/models'
import { CertificateValidator } from '../helpers/CertificateValidator'
import { TestControllerProduct, allProducts, validDateObj } from '../types/testResult'
import { SendEmail } from '../helpers/SendEmail'
import { ValidDate } from '../helpers/ValidDate'
import { WriteFile } from '../helpers/WriteFile'
import { CreateProductCertificates } from '../helpers/CreateProductCertificates'
import { DeleteAllProductsByCompany,
        DeleteAllCertByCompany,
        DeleteProduct, 
        DeleteProductCertificates,
        UpsertProduct,
        GetUniqueProduct,
        GetAllProductsByCompanyid } from '../helpers/PrismaHelper'

// TENGI COMPANY ID = 4

const TengiAPI = "https://api.integrator.is/Products/GetMany/?CompanyId=608c19f3591c2b328096b230&ApiKey=b3a6e86d4d4d6612b55d436f7fa60c65d0f8f217c34ead6333407162d308982b&Status=2&Brands=61efc9d1591c275358c86f84" 

var updatedProducts = [];
var createdProducts = [];
var productsNotValid = [];

export const InsertAllTengiProducts = async(req, res) => {
    const tengiData = await requestTengiApi();  
    //process all data and insert into database
    await GetProducts(tengiData)
    return res.end("We made it! And it's great");
};

export const DeleteAllTengiProducts = async(req,res) => {
    // delete all products with company id 4
    DeleteAllProductsByCompany(4)
    res.end("All Tengi products deleted")
}


export const DeleteAllTengiCert = async(req,res) => {
    // delete all product certificates connected to company id 4
    DeleteAllCertByCompany(4)
    res.end("all product certificates deleted for Tengi")
  }

const requestTengiApi = async() => {
  return axios.get(TengiAPI).then(response => {
    if (response.status === 200) {
      const data = response;
      // console.log('DATA', data.data)
      return data.data;
    }else{
      console.log(`Error occured : ${response.status} - ${response.statusText}`);
    } 
  });
}

const getcat = async(data) => {
  var categories = []
  data.map(prod => {
    // console.log('prod', prod.fl)
    prod.fl.map(cat => {
      // console.log('cat', cat.Name)
      if(!categories.includes(cat.Name)) {
        categories.push(cat.Name)
      }
    })
  })
  console.log(categories)
}

// WRITE FILES MISSING HERE


const GetProducts = async(data) => {
  // console.log("DATA NUNA",data.Data)
  const allprod : Array<TestControllerProduct> = [];
  data.Data.map(prod => {
    // console.log('PROD', prod.StandardFields.Categories[1].Name)
    var temp_prod : TestControllerProduct = {
      id: prod.StandardFields.SKU,
      prodName: prod.StandardFields.Name,
      longDescription: prod.StandardFields.Description,
      shortDescription: prod.StandardFields.ShortDescription,
      fl: prod.StandardFields.Categories[1].Name, // Breyta nuna er allt að fá child nr 1 sem flokk
      prodImage: prod.Images[0].Url,
      url: 'https://www.tengi.is/', // EKKI HÆGT AÐ SKOÐA VÖRU Á VEF ÞVÍ ÞAÐ ER EKKI LINKUR
      brand: prod.StandardFields.Brands[0].Name,
      fscUrl: "vantar",
      epdUrl: "vantar",
      vocUrl: "vantar",
      ceUrl: "vantar",
      certificates: [
          { name: "fsc", val:  "FALSE" },
          { name: "epd", val:  "FALSE" },
          { name: "voc", val:  "FALSE" },
          { name: "sv_allowed", val:  "TRUE" },
          { name: "sv", val:  "FALSE" },
          { name: "breeam", val:  "FALSE" },
          { name: "blengill", val:  "FALSE" },
          { name: "ev", val: "FALSE" },
          { name: "ce", val: "TRUE" }
      ]

    }
    allprod.push(temp_prod)
  })
  // console.log('ALL prods', allprod)
  ProcessForDatabase(allprod)
}

const UpsertProductInDatabase = async(product : TestControllerProduct, approved : boolean, create : boolean, certChange : boolean) => {
  // get all product certificates from sheets
  const convertedCertificates: Array<Certificate> = product.certificates.map(certificate => { if(certificate.val=="TRUE") {return {name: certificate.name.toUpperCase() }} })
  Object.keys(convertedCertificates).forEach(key => convertedCertificates[key] === undefined && delete convertedCertificates[key]);
  const validatedCertificates = CertificateValidator({ certificates: convertedCertificates, fscUrl: product.fscUrl, epdUrl: product.epdUrl, vocUrl: product.vocUrl, ceUrl: product.ceUrl })
  // console.log("vorunumber", product.id == "")
  if(validatedCertificates.length === 0){
    // no valid certificates for this product
    productsNotValid.push(product)
    return;
  }
  if(create === true) {
    console.log('created')
    if (validatedCertificates.length !== 0) {
      console.log('valid certs', validatedCertificates)
      if (product.id !== "") {
        console.log('prod id')
        createdProducts.push(product)
        // check valid date when product is created
        var validDate = await ValidDate(validatedCertificates, product)
      }
    }
  }
  if(certChange === true) {
    //delete all productcertificates so they wont be duplicated and so they are up to date
    DeleteProductCertificates(product.id)
    if(validatedCertificates.length !== 0 ) {
      if (product.id !== "") {
        updatedProducts.push(product)
        // check valid date when the certificates have changed
        var validDate = await ValidDate(validatedCertificates, product)
      }
    }
  }
  // update or create product in database if the product has a productnumber (vörunúmer)
  if(product.id !== "") {
    console.log('for alla leið hingað')
    await UpsertProduct(product, approved, 4)
    if(certChange === true || create === true) {
      console.log('og at last komst hingað')
      await CreateProductCertificates(product, validDate, validatedCertificates)
    }
  }
}

const isProductListFound = async(products : Array<TestControllerProduct>) => {
  // get all current products from this company
  const currprods = await GetAllProductsByCompanyid(4)
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
  // productsNoLongerComingInWriteFile(nolonger)
  // deleta prodcut from prisma database
  nolonger.map(product => {
    DeleteProduct(product.productid)
  })
}


const ProcessForDatabase = async(products : Array<TestControllerProduct>) => {
  // check if product is in database but not coming in from company anymore
  // isProductListFound(products)

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
      var certChange = false;
      // console.log('CREATED')
    }
    UpsertProductInDatabase(product, approved, create, certChange)
  })
  // write all appropriate files
  // WriteAllFiles()
}