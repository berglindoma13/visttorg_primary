import { ProductCertificate } from './certificates'

export interface ProductProps {
  id : number,
  productid: string,
  title : string,
  description : string,
  shortdescription : string,
  brand : string,
  sellingcompany : Company
  productimageurl : string
  categories : Array<Category>
  url : string,
  fscUrl : string,
  epdUrl : string,
  vocUrl : string,
  certificates : Array<ProductCertificate>
}

export interface Company{
  id : number,
  name : string,
  websiteurl: string,
}

export interface Category{
  id: number
  name: string
}