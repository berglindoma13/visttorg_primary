import express from "express";
const router = express.Router();
import { InsertAllBykoProducts, TestProduct, GetAllCategories, DeleteAllProducts, DeleteAllProducCertificates } from '../controllers/BykoController';

function routes(app : any) {
  //COMPANY ID IN DATABASE IS 1
  app.get('/api/byko', InsertAllBykoProducts);
  app.get('/api/testByko', TestProduct)
  // app.get('/api/byko/deleteall/categories', byko_controller.DeleteAllCategories);
  app.get('/api/byko/deleteall/products', DeleteAllProducts);
  app.get('/api/byko/deleteall/productcertificates', DeleteAllProducCertificates);
  app.get('/api/byko/getallcategories', GetAllCategories);

  return router;
};  



module.exports = routes;