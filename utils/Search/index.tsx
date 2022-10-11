import Fuse from 'fuse.js'
import { ProductProps } from '../../types/products'

interface SearchProductsProps {
  fuseInstance: Fuse<ProductProps>
  query?: string
  activeCategories?: Array<string>
  activeSubCategories?: Array<string>
  activeCertificates?: Array<string>
  activeCompanies?: Array<string>
}
export const SearchProducts = ({ fuseInstance, query, activeCategories, activeSubCategories, activeCertificates, activeCompanies} : SearchProductsProps) => {

  let queryMaker = { $and : []}

  if(query){
    queryMaker.$and.push({
      $or: [{ 'title': query }, { 'description': query }, { 'brand': query }, { 'sellingcompany.name': query }, { 'categories.name': query }, { 'subcategories.name': query }, { 'certificates.certificate.name': query }, { 'shortdescription': query }]
    })
  }

  if(activeSubCategories.length > 0){
    const categoriesOrLogic = activeSubCategories.map(category =>  {
      return { 'subCategories.name': category}
    })

    queryMaker.$and.push({
      $or: categoriesOrLogic
    })
  }
  else if(activeCategories.length > 0 ){
    const categoriesOrLogic = activeCategories.map(category =>  {
      return { 'categories.name': category}
    })

    queryMaker.$and.push({
      $or: categoriesOrLogic
    })
  }

  if(activeCertificates.length > 0 ){
    const certificatesOrLogic = activeCertificates.map(certificate =>  {
      return { 'certificates.certificate.name': certificate}
    })

    queryMaker.$and.push({
      $or: certificatesOrLogic
    })
  }

  if(activeCompanies.length > 0 ){
    const companiesOrLogic = activeCompanies.map(company =>  {
      return { 'sellingcompany.name': company}
    })

    queryMaker.$and.push({
      $or: companiesOrLogic
    })
  }

  console.log('querymaker', queryMaker)

  const result = fuseInstance.search(queryMaker)

  return result
}