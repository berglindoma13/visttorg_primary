import { Router } from 'express';
import { InsertAllBykoProducts, TestProduct, GetAllCategories, DeleteAllProducts, DeleteAllProducCertificates } from '../controllers/BykoController';
import { InsertAllSheetsProducts, /*ProcessNewInDatabase*/ DeleteAllSheetsProducts, /*DeleteAllSheetsProductCertificates*/ DeleteAllSheetsCert, /*SendEmail*/ } from '../controllers/testController';
import { fileUpload } from '../controllers/ProductUploadController'
import { Postlist } from '../controllers/Postlist'

export const allRoutes = Router();

allRoutes.get('/', (req, res) => {
  res.send("What's up doc ?!");
});

allRoutes.get('/api/byko', InsertAllBykoProducts);
allRoutes.get('/api/testByko', TestProduct)
// app.get('/api/byko/deleteall/categories', byko_controller.DeleteAllCategories);
allRoutes.get('/api/byko/deleteall/products', DeleteAllProducts);
allRoutes.get('/api/byko/deleteall/productcertificates', DeleteAllProducCertificates);
allRoutes.get('/api/byko/getallcategories', GetAllCategories);

allRoutes.get('/api/testcontroller', InsertAllSheetsProducts);
allRoutes.get('/api/deletesheets', DeleteAllSheetsProducts);
allRoutes.get('/api/deletesheetscertificates', DeleteAllSheetsCert);
// companyRoutes.get('/api/testnewindatabase', ProcessNewInDatabase)

// app.post('/api/product/add', fileUpload)

//add to postlist
allRoutes.post('/api/postlist', Postlist)
// allRoutes.get('/api/sendmail', SendEmail)