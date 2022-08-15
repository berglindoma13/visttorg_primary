// import express from "express";
// // import { InsertAllBykoProducts, TestProduct, GetAllCategories, DeleteAllProducts, DeleteAllProducCertificates } from '../controllers/BykoController';
// // import { fileUpload } from '../controllers/ProductUploadController'
// // import { Postlist } from '../controllers/Postlist'

// // import { InsertAllSheetsProducts, /*ProcessNewInDatabase*/ DeleteAllSheetsProducts, /*DeleteAllSheetsProductCertificates*/ DeleteAllSheetsCert, /*SendEmail*/ } from '../controllers/testController';

// function routes(app : any) {
//   //COMPANY ID IN DATABASE IS 1
//   app.get('/', (req: any, res: any) => res.send('Hello World!'));
//   // app.get('/api/byko', InsertAllBykoProducts);
//   // app.get('/api/testByko', TestProduct)
//   // // app.get('/api/byko/deleteall/categories', byko_controller.DeleteAllCategories);
//   // app.get('/api/byko/deleteall/products', DeleteAllProducts);
//   // app.get('/api/byko/deleteall/productcertificates', DeleteAllProducCertificates);
//   // app.get('/api/byko/getallcategories', GetAllCategories);
  
//   // app.get('/api/testcontroller', InsertAllSheetsProducts);
//   // app.get('/api/deletesheets', DeleteAllSheetsProducts);
//   // app.get('/api/deletesheetscertificates', DeleteAllSheetsCert);
//   // // app.get('/api/testnewindatabase', ProcessNewInDatabase)
  
//   // app.post('/api/product/add', fileUpload)
//   // // app.post('/api/product/add', fileUpload)
  
//   // //add to postlist
//   // app.post('/api/postlist', Postlist)
//   // app.get('/api/sendmail', SendEmail)
//   return router;
// };  


// export const router = express.Router();
// router.use(routes)

import express from 'express';
import { allRoutes } from './allRoutes';

export const routes = express.Router();

routes.use(allRoutes);