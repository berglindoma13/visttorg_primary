import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { mediaMax } from '../../constants/breakpoints'
import { Certificate } from '../../types/certificates'
import { Company, ProductProps } from '../../types/products'
import { TextInput } from '../Inputs'
import { Heading1Large, Heading6, UIMedium } from '../Typography'
import Fuse from 'fuse.js'
import { FilterButton, FilterItem, MainButton } from '../Buttons'
import { SearchProducts } from '../../utils/Search'
import { motion, useAnimation } from "framer-motion"
import { Product } from '../Product'
import { Pagination } from '../Pagination'
import { useRouter } from 'next/router'
import { useIsTablet } from '../../utils/mediaQuery/useMediaQuery'
import { Close, MagnifyingGlass } from '../Svg'
import certificateMapper from '../../mappers/certificates'

interface SearchPageProps{
  products: Array<ProductProps>
  certificates : Array<Certificate>
  companies: Array<Company>
  companyCounts: Array<Counter>
  certificateCounts: Array<Counter>
}

interface CategoryProps{
  name: string
  subCategories: Array<string>
}

interface FilterProps{
  brand: Array<string>
  companies: Array<string>
  certificates: Array<string>
  categories: Array<CategoryProps>
}

interface Counter {
  name: string
  count: number
}

export const SearchPage = ({ products = [], certificates, companies, certificateCounts, companyCounts }: SearchPageProps) => {
  const [query, setQuery] = useState("");
  const [paginationNumber, setPaginationNumber] = useState<number>(1)
  
  const router = useRouter()
  const paginationPageSize = 9
  const isTablet = useIsTablet()

  const [filteredProductList, setFilteredProductList] = useState<Fuse.FuseResult<ProductProps>[]>([])
  const [filterDrawerIsActive, setFilterDrawerIsActive] = useState(false)
  const [filters, setFilters] = useState<FilterProps>({
    brand: [],
    companies: [],
    certificates: [],
    categories: []
  })
  const [subfilters, setSubFilters] = useState<Array<string>>([])

  const options = {
    // isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.4,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    keys: [
      'title',
      'description',
      'shortdescription',
      'brand',
      'sellingcompany.name',
      'categories.name',
      'certificates.certificate.name'],
  }

  const VisttorgCategories = [
    {name: "Lýsing og rafmagn", subCategories: ["Húsgögn", "Heimilistæki"], weight: 1 },
    {name: "Eldhús", subCategories: ["Húsgögn", "Heimilistæki"], weight: 1 },
    {name: "Baðherbergi", subCategories: ["Húsgögn", "Heimilistæki"], weight: 1 },
    {name: "Gólfefni", subCategories: ["Húsgögn", "Heimilistæki"], weight: 1 },
    {name: "Garðurinn", subCategories: ["Húsgögn", "Heimilistæki"], weight: 1 },
    {name: "Gluggar", subCategories: ["Húsgögn", "Heimilistæki"], weight: 1 },
    {name: "Burðavirki", subCategories: ["Húsgögn", "Heimilistæki"], weight: 2 },
    {name: "Loftaefni", subCategories: ["Veggir", "Málningarvörur"], weight: 2 },
    {name: "Hurðir", subCategories: ["hur1", "hur2", "hur3"], weight: 2 },
    {name: "Lagnir", subCategories: ["lag", "lag2", "lag3"], weight: 2 },
    {name: "Textíll", subCategories: ["tex1", "tex2", "tex3"], weight: 2 },
    {name: "Lyftur", subCategories: ["lyf1", "lyf2", "lyf3"], weight: 2 },
    {name: "Öryggi og merkingar", subCategories: ["öry1", "öry2", "öry3"], weight: 2 },
    {name: "Vélbúnaður", subCategories: ["Heimilistæki", "Húsgögn"], weight: 2 },
    // {name: "Húsgögn", items: ["hús1", "hús2", "hús3"]},
    // {name: "Heimilistæki", items: ["hei1", "hei2", "hei3"]},
    // {name: "Veggir", items: ["veg1", "veg2", "veg3"]},
    // {name: "Málningarvörur", items: ["mál1", "mál2", "mál3"]}
  ]

  const fuseInstance = new Fuse(products, options)

  const resetFilteredProductList = () => {
    const resultProducts: Fuse.FuseResult<ProductProps>[] = products.map((product, index) => {
      return { item : product, refIndex: index, score: 1}
    })
    setFilteredProductList(resultProducts)
  }

  //Initialize filteredProductList as all products
  useEffect(() => {
    resetFilteredProductList()

    //Initalize the sessionStorage items for the filtering if any, when coming back after pressing on a product card
    getSessionStorageItems()
  }, [])
  
  //This checks the pagination status and updates current status
  useEffect(() => {
    const { page, query, cat } = router.query
    if(!!page){
      setPaginationNumber(parseInt(page.toString()))
    }

    if(!!query){
      setQuery(query.toString())
    }

    if(!!cat){
      toggleFilters('categories', cat.toString())
    }
  }, [router])

  useEffect(() => {
     //Reset pagination 
     onChangePagination(1)

     //Set the sessionStorageitems for keeping the state of the filtering when going back after pressing a product card
     setSessionStorageItems()

    //if no filters are active, then show all products
    if(!query && filters.categories.length === 0 && filters.certificates.length === 0 && filters.companies.length === 0){
      resetFilteredProductList()
    }else{
      const results = SearchProducts({
        fuseInstance, 
        query, 
        activeCategories: filters.categories.map(category => category.name),
        // activeCategories: ["Burðavirki"],
        activeSubCategories: subfilters,
        activeCertificates: filters.certificates, 
        activeCompanies: filters.companies
      })
      setFilteredProductList(results)
    }
  }, [filters, query, subfilters])

  const toggleFilters = (filter: string, value: any) => {

    //close drawer on filterToggle in tablet and mobile
    if(isTablet){
      setFilterDrawerIsActive(false)
    }

    //if value is already in list -> remove
    if(filter=="categories" && filters.categories.filter(cat=>cat.name==value.name).length>0){
      const filteredArray = filters[filter].filter(item => item.name !== value.name)
      setFilters({...filters, [filter]: filteredArray})
    }
    else if(filters[filter].includes(value)){
      const filteredArray = filters[filter].filter(item => item !== value)
      setFilters({...filters, [filter]: filteredArray})
    }
    else{
      setFilters({...filters, [filter]: [...filters[filter], value ]})
    }
  }

  const toggleSubFilters = (value: string) => {

    //close drawer on filterToggle in tablet and mobile
    if(isTablet){
      setFilterDrawerIsActive(false)
    }

    //if value is already in list -> remove
    if(subfilters.includes(value)){
      const filteredArray = subfilters.filter(item => item !== value)
      setSubFilters(filteredArray)
    }else{
      setSubFilters([...subfilters, value])
    }
  }

  const onChangePagination = (number: number) => {
    setPaginationNumber(number)
    router.push(`/?page=${number}`, undefined, { shallow: true })
  }

  const getCompanyCounts = (comp) => { var val = 0
    companyCounts.map(compcount => { 
      if(compcount.name === comp) {
        val = compcount.count
      }
    })
    return val
  }

  const setSessionStorageItems = () => {
    if(filters.brand.length > 0 || filters.categories.length > 0 || filters.certificates.length > 0|| filters.companies.length > 0){
      sessionStorage.setItem('level1Filters', JSON.stringify(filters))
    }else{
      sessionStorage.setItem('level1Filters', null)
    }
    sessionStorage.setItem('level2Filters', null)
    sessionStorage.setItem('queryParam', !!query ? query : null)
  }

  const getSessionStorageItems = () => {
    const level1Filters = sessionStorage.getItem('level1Filters')
    const level2Filters = sessionStorage.getItem('level2Filters')
    const queryFilter = sessionStorage.getItem('queryParam')

    //Scroll to searchPage if any sessionItems are present and open the filterBar
    if(level1Filters !== 'null' || level2Filters !== 'null' || queryFilter !== 'null'){
      document.getElementById("search").scrollIntoView();
      setFilterDrawerIsActive(true)
    }

    if(level1Filters !== 'null'){
      setFilters(JSON.parse(level1Filters))
    }
    if(level2Filters !== 'null'){
      // setFilters(JSON.parse(level2Filters))
    }
    if(queryFilter !== 'null'){
      setQuery(queryFilter)
    }
  }

  const getCertificateCounts = (cert) => { var val = 0
    certificateCounts.map(certcount => {
      if(certcount.name === cert) {
        val = certcount.count
      }
    })
    return val
  }

  //Framer motion controls for showing and hiding filter drawer
  const controls = useAnimation()
  const fadeInControls = useAnimation()
  
  useEffect(() => {
    if(filterDrawerIsActive){
      if(!isTablet){
        controls.start({
          x: "0px",
          width: '100%'
        })
  
        fadeInControls.start({
          opacity: 1,
          transition: { duration : 0.8 }
        })
      }else{
        controls.start({
          x: "0px",
          width: '100%'
        })
  
        fadeInControls.start({
          opacity: 1,
          x: "0px",
          transition: { duration : 0.2 }
        })
      }
    }

    else if(!filterDrawerIsActive){
      if(!isTablet){
        controls.start({
          x: "-217px",
          width: 'calc(100% + 427px)'
        })
  
        fadeInControls.start({
          opacity: 0,
          transition: { duration : 0 }
        })
      }else{
        controls.start({
          x: "0px",
          width: '100%'
        })
  
        fadeInControls.start({
          opacity: 0,
          x: "-100%",
          transition: { duration : 0.2 }
        })
      }
    }


  }, [filterDrawerIsActive, isTablet])

  return (
    <SearchPageContainer>
      <div id="search">
      </div>
      <StyledTitle>Taktu grænni skref</StyledTitle>
      <StyledInput 
        placeholder='Leitaðu eftir vöru' 
        onChange={(input) => {
          setQuery(input.target.value)
        }}
        onSubmit={() => {}}
        value={query}
        inputIcon={<MagnifyingGlass />}
      />

      <ProductCountText>{`${filteredProductList.length} af ${products.length}`}</ProductCountText>
      <CategoryFilters>
        <StyledFilterButton text='Sía' onClick={() => setFilterDrawerIsActive(!filterDrawerIsActive)} active={filterDrawerIsActive} />
        {/* <MainButton text='Baðherbergi' onClick={() => {toggleFilters('categories', 'Baðherbergi')}} active={false} /> */}
        {VisttorgCategories.map(cat => {
          if(cat.weight == 1) {
            return(
              <StyledMainButton
                key={cat.name}
                text={cat.name}
                onClick={() => {
                  toggleFilters('categories', cat)
                }} 
                active={filters.categories && filters.categories.filter(category=>category.name==cat.name).length>0} 
              />
            )
          }
        })}
      </CategoryFilters>
      <ProductsAndFilter
        animate={controls}
        transition={{ type: "Tween" }}
      >
        <FilterWrapper
          animate={fadeInControls}
        >
          <CloseFilterButton onClick={() => setFilterDrawerIsActive(false)}><Close fill="#000"/></CloseFilterButton>
          <FilterGroup>
            <FilterGroupTitle>Söluaðilar</FilterGroupTitle>
            <FilterItems>
              {companies.map(company => {
                return(
                  <FilterItem 
                    key={company.id}
                    text={company.name}
                    num={getCompanyCounts(company.name)} 
                    onClick={() => {
                      toggleFilters('companies', company.name)
                    }} 
                    active={filters.companies.includes(company.name)} 
                  />
                )
              })}
            </FilterItems>
          </FilterGroup>
          <FilterGroup>
            <FilterGroupTitle>Vottanir</FilterGroupTitle>
            <FilterItems>
              {certificates.map(certificate => {
                return(
                  <FilterItem 
                    key={certificate.id}
                    text={certificateMapper[certificate.name]} 
                    num={getCertificateCounts(certificate.name)} 
                    onClick={() => {
                      toggleFilters('certificates', certificate.name)
                    }} 
                    active={filters.certificates.includes(certificate.name)}
                  />
                )
              })}
            </FilterItems>
          </FilterGroup>
          <FilterGroup>
            <FilterGroupTitle>VisttorgCategories</FilterGroupTitle>
            <FilterItems>
              {VisttorgCategories.map(item => {
                if(item.weight == 2){
                  return(
                    <FilterItem 
                      key={item.name}
                      text={item.name} 
                      onClick={() => {
                        toggleFilters('categories', item)
                      }} 
                      active={filters.categories.filter(cat=>cat.name==item.name).length>0}
                    />
                  )
                }
              })}
            </FilterItems>
          </FilterGroup>
          <FilterGroup>
            { filters.categories.length !== 0 && <>
            <FilterGroupTitle>UndirVisttorgCategories</FilterGroupTitle>
            <FilterItems>
              {filters.categories.map(category => {
                return(
                category.subCategories.map(sub => {
                  return(
                    <FilterItem 
                      key={sub}
                      text={sub} 
                      onClick={() => {
                        toggleSubFilters(sub)
                      }} 
                      active={subfilters.includes(sub)}
                    />
                  )
                }))
                })
              }
            </FilterItems>
            </>}
          </FilterGroup>
        </FilterWrapper>
        <ProductList>
          {filteredProductList.length === 0 && <NoResults>Engar vörur fundust</NoResults>}
          {filteredProductList.map((product, index) => {
            if(index >= (paginationNumber - 1) * paginationPageSize && index < paginationNumber * paginationPageSize){
              const thisProduct = product.item
              return (
                <StyledProduct
                  key={thisProduct.productid}
                  productId={thisProduct.productid}
                  title={thisProduct.title}
                  shortdescription={thisProduct.shortdescription}
                  sellingcompany={thisProduct.sellingcompany.name}
                  productimageurl={thisProduct.productimageurl}
                />
              )
            }else{

            }
          })}
        </ProductList>
      </ProductsAndFilter>
      {filteredProductList.length !== 0 &&
      <Pagination 
        currentPage={paginationNumber}
        setCurrentPage={onChangePagination}
        queryParamName='productPage'
        total={filteredProductList.length}
        pageSize={paginationPageSize}
      />}
    </SearchPageContainer>
  )
}

const FilterGroup = styled.div`
  margin-bottom:55px;
`

const FilterGroupTitle = styled(Heading6)`
  margin-bottom:25px;
`

const FilterItems = styled.div`
  display:flex;
  flex-direction:row;
  flex-wrap: wrap;
`

const ProductsAndFilter = styled(motion.div)`
  display:flex;

  @media ${mediaMax.tablet}{
    padding: 0 15px;
  }
`

const FilterWrapper = styled(motion.div)`
  min-width: 410px;
  max-width:410px;
  background-color: #fff;
  margin-right:30px;
  margin-left:20px;
  padding: 35px 35px 50px 35px;
  height:fit-content;
  border-radius: 16px;

  @media ${mediaMax.tablet}{
    position: fixed;
    z-index: 11;
    max-width: 100vw;
    min-width: 100vw;
    margin: 0;
    top: 0;
    left:0;
    height: 100vh;
    overflow:auto;
  }
`

const CloseFilterButton = styled.button`
  display:none;
  border:none;
  cursor: pointer;
  background:transparent;

  @media ${mediaMax.tablet}{
    position: fixed;
    display:block;
    z-index: 11;
    top: 16px;
    right: 16px;
  }
`

const ProductList = styled.div`
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  width:100%;
  justify-content: center;
`

const StyledProduct = styled(Product)`
  margin-right: 15px;
  margin-bottom:15px;

  @media ${mediaMax.tablet}{
    margin-right:0;
  }
`

const SearchPageContainer = styled.div`
  display:flex;
  flex-direction:column;
  align-items: center;
  position:relative;
`

const StyledTitle = styled(Heading1Large)`
  width: 63%;
  text-align:center;
  margin-bottom:90px;

  @media ${mediaMax.tablet}{
    margin-bottom:65px;
    width:80%;
  }
`

const StyledInput = styled(TextInput)`
  width: 390px;
  margin-bottom:45px;

  @media ${mediaMax.tablet}{
    width: 90%;
  }
`

const ProductCountText = styled(UIMedium)`
  color: ${({ theme }) => theme.colors.grey_four};
  width:100%;
  text-align:center;
`

const StyledMainButton = styled(MainButton)`
  margin: 0 5px;
`
const StyledFilterButton = styled(FilterButton)``

const CategoryFilters = styled.div`
  display:flex;
  flex-direction:row;
  padding: 0 13%;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  height: 150px;
  overflow:scroll;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  @media ${mediaMax.tabletL}{
    padding: 0 0 0 10px;

    ${StyledMainButton}, ${StyledFilterButton}{
      margin-right:8px;
    }
  }

  @media ${mediaMax.tablet}{
    height: 117px;
    
  }
`
const NoResults = styled.div`
  width: 100%;
  font-size: max(1.52vw, 22px);
  text-align: center;
  padding-top: 20px;
  color: black;
`