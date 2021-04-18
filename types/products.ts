import { ProductCertificate } from './certificates'

export interface ProductProps {
  Id : string,
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
  name : String
}

export interface Category{
  id: number
  name: string
}