import { ProductCertificate, CertificateSystem } from './certificates'

export interface ProductProps {
  id: string
  productid: string,
  title: string,
  description: string,
  shortdescription: string,
  categories: Array<Category>,
  subCategories: Array<Category>,
  companyid: number
  sellingcompany: Company
  productimageurl: string,
  url: string,
  brand: string,
  certificates: Array<ProductCertificate>
  certificateSystems?: Array<CertificateSystem>
  approved: boolean
}

export interface Company{
  id : number
  name : string
  websiteurl: string
  contact: string
}

export interface Category{
  id: number
  name: string
}

export interface SubCategory {
  id: number
  name: string
  parentCategoryName: string
}