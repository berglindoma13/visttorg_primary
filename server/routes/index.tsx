import express from "express";
const router = express.Router();
import { InsertAllBykoProducts, TestProduct, GetAllCategories, DeleteAllProducts, DeleteAllProducCertificates } from '../controllers/BykoController';
import { fileUpload } from '../controllers/ProductUploadController'

import { InsertAllSheetsProducts, /*ProcessNewInDatabase*/ DeleteAllSheetsProducts, /*DeleteAllSheetsProductCertificates*/ DeleteAllSheetsCert } from '../controllers/testController';

function routes(app : any) {
  //COMPANY ID IN DATABASE IS 1
  app.get('/api/byko', InsertAllBykoProducts);
  app.get('/api/testByko', TestProduct)
  // app.get('/api/byko/deleteall/categories', byko_controller.DeleteAllCategories);
  app.get('/api/byko/deleteall/products', DeleteAllProducts);
  app.get('/api/byko/deleteall/productcertificates', DeleteAllProducCertificates);
  app.get('/api/byko/getallcategories', GetAllCategories);

  app.get('/api/testcontroller', InsertAllSheetsProducts);
  app.get('/api/deletesheets', DeleteAllSheetsProducts);
  app.get('/api/deletesheetscertificates', DeleteAllSheetsCert);
  // app.get('/api/testnewindatabase', ProcessNewInDatabase)
  
  app.post('/api/product/add', fileUpload)
  // app.post('/api/product/add', fileUpload)

  // app.get('api/egs/importfile', bla)

  return router;
};  



module.exports = routes;