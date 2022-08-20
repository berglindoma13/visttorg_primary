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

const TengiAPI = "https://www.tengi.is/product-category/badherbergi/fylgihlutir/?swoof=1&product_tag=unidrain&really_curr_tax=231-product_cat"

var updatedProducts = [];
var createdProducts = [];
var productsNotValid = [];

export const InsertAllTengiProducts = async(req, res) => {
    const tengiData = await requestTengiApi();  
    //process all data and insert into database
    await ProcessForDatabase(tengiData)
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
      console.log('DATA', data.data)
      return data;
    }else{
      console.log(`Error occured : ${response.status} - ${response.statusText}`);
    } 
  });
}

// WRITE FILES MISSING HERE

const ProcessForDatabase = async(data) => {
    console.log(data)
}