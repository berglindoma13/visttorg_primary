import { ProductCertificate, CertificateSystem } from './certificates'

export interface ProductProps {
  id:number
  productid: string,
  title: string,
  description: string,
  shortdescription: string,
  categories: Array<Category>,
  subCategories: Array<Category>,
  sellingcompany: Company
  productimageurl: string,
  url: string,
  brand: string,
  fscUrl: string,
  epdUrl: string,
  vocUrl: string,
  ceUrl: string,
  certificates: Array<ProductCertificate>
  certificateSystems?: Array<CertificateSystem>
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