import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { mediaMax } from '../../constants/breakpoints'
import { Certificate, CertificateSystem } from '../../types/certificates'
import { Company, ProductProps } from '../../types/products'
import { TextInput } from '../Inputs'
import { Heading1Large, Heading3, Heading4, Heading6, UIMedium } from '../Typography'
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
import PaintBucket from '../../public/PaintBucketIcon.svg'
import Image from 'next/image'
import currentCategoryTemplate from "../../currentCategoryTemplate.json"
// import InfiniteScroll from "react-infinite-scroll-component";
// import CloseIcon from '../Svg/Close'

interface SearchPageProps{
  products: Array<ProductProps>
  certificates : Array<Certificate>
  companies: Array<Company>
  companyCounts: Array<Counter>
  certificateCounts: Array<Counter>
  certificateSystems: Array<CertificateSystem>
}

interface CategoryProps{
  name: string
  subCategories: Array<SubCatergoryProps>
}

interface SubCatergoryProps {
  name: string
}

interface FilterProps{
  brand: Array<string>
  companies: Array<string>
  certificates: Array<string>
  certificateSystems: Array<string>
  categories: Array<CategoryProps>
}

interface Counter {
  name: string
  count: number
}

interface CategoryProps{
  name: string;
  subCategories: {
      name: string;
  }[];
  weight: number;
}

export const SearchPage = ({ products = [], certificates, companies, certificateCounts, companyCounts, certificateSystems }: SearchPageProps) => {  
  const [query, setQuery] = useState("");
  const [paginationNumber, setPaginationNumber] = useState<number>(1)
  const [originalValue, setOriginalValue] = useState(true)
  const router = useRouter()
  const isTablet = useIsTablet()

  useEffect(() => {
    setFilterDrawerIsActive(isTablet ? false : true)
  }, [isTablet])

  const [filteredProductList, setFilteredProductList] = useState<Fuse.FuseResult<ProductProps>[]>([])
  const [filterDrawerIsActive, setFilterDrawerIsActive] = useState(false)
  const [filters, setFilters] = useState<FilterProps>({
    brand: [],
    companies: [],
    certificateSystems: [],
    certificates: [],
    categories: []
  })
  const [subfilters, setSubFilters] = useState<Array<string>>([])
  const [paginationPageSize, SetPaginationPageSize] = useState(12)
  const [numberOfActiveFilters, SetNumberOfActiveFilters] = useState(0)

  const options = {
    // isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.1,
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
      'subCategories.name',
      'certificateSystems.name',
      'certificates.certificate.name'],
  }

  const VisttorgCategories: Array<CategoryProps> = currentCategoryTemplate

  // console.log('curr', currentCategoryTemplate)

  const fuseInstance = new Fuse(products, options)

  const aa = products.filter(x => x.sellingcompany.id == 5)
  console.log('aa', aa)

  const resetFilteredProductList = () => {
    const resultProducts: Fuse.FuseResult<ProductProps>[] = products.map((product, index) => {
      return { item : product, refIndex: index, score: 1}
    })

    setFilteredProductList(resultProducts)
  }

  //Initialize filteredProductList as all products
  useEffect(() => {
    //resetFilteredProductList()
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
      VisttorgCategories.map(item => {
        if(item.name === cat.toString()) {
          toggleFilters('categories', item)
        }
      })
    }
  }, [router])

  useEffect(() => {
    //dont run this code on load, only on change
    if(!originalValue){
      //Reset pagination
      // onChangePagination(1)
      // Set pagination to the current page --> má ekki taka þetta alveg út?
      onChangePagination(paginationNumber)
    }

    //Set the sessionStorageitems for keeping the state of the filtering when going back after pressing a product card
    setSessionStorageItems()

    //if no filters are active, then show no products
    if(!query && filters.categories && filters.categories.length === 0 && filters.certificates.length === 0 && filters.companies.length === 0 && filters.certificateSystems.length === 0){
      resetFilteredProductList()
      SetNumberOfActiveFilters(0);

    }else{
      const results = SearchProducts({
        fuseInstance, 
        query, 
        activeCategories: filters.categories.map(category => category.name),
        activeSubCategories: subfilters,
        activeCertificates: filters.certificates, 
        activeCompanies: filters.companies,
        activeCertificateSystems: filters.certificateSystems
      })
      // console.log('results', results)
      const activeFiltersSize = filters.categories.length+subfilters.length+filters.certificates.length+filters.certificateSystems.length+filters.companies.length
      SetNumberOfActiveFilters(activeFiltersSize);
      console.log('activeFiltersnumber', activeFiltersSize)
      setFilteredProductList(results)

      console.log('filters', filters)
      console.log('results', results)
    }

    setOriginalValue(false)
  }, [filters, query, subfilters])

  const toggleFilters = (filter: string, value: CategoryProps | string) => {
    // reset pagination when a filter is chosen
    onChangePagination(1)
  
    const currentMainFilters = VisttorgCategories.filter(cat => cat.weight == 1 && typeof value !== "string" && cat.name == value.name)

    // close drawer on filterToggle in tablet and mobile
    // check if pressing level1 filters, if they are pressed then filterdrawer stays closed else it stays open
    if(isTablet && currentMainFilters.length != 0){
      setFilterDrawerIsActive(false)
    }
    else if(isTablet) {
      setFilterDrawerIsActive(true)
    }

    //if value is already in list -> remove / only categories
    if(filter=="categories" 
      && filters.categories
      && typeof value !== "string" 
      && filters.categories.filter(cat => cat.name == value.name).length > 0
    ){
      const filteredArray = filters[filter].filter(item => item.name !== value.name)
      setFilters({...filters, [filter]: filteredArray})

      //remove relevant subfilters
      const filteredSubFilters = subfilters.filter(item => value.subCategories.filter(x => x.name == item).length === 0)
      setSubFilters(filteredSubFilters)

      // set number in the brackets in the sia button
      SetNumberOfActiveFilters(numberOfActiveFilters-1);
    }
    //if value is already in list -> other than categories
    else if(filters[filter].includes(value)){
      const filteredArray = filters[filter].filter(item => item !== value)
      setFilters({...filters, [filter]: filteredArray})

      // set number in the brackets in the sia button
      SetNumberOfActiveFilters(numberOfActiveFilters-1);
    }
    //if value is not in list, add it to the list
    else{
      console.log('here 1')
      setFilters({...filters, [filter]: [...filters[filter], value ]})

      // set number in the brackets in the sia button
      SetNumberOfActiveFilters(numberOfActiveFilters+1);
    }
  }

  const toggleSubFilters = (value: string) => {
    // reset pagination when a subfilter is chosen
    onChangePagination(1)
    //close drawer on filterToggle in tablet and mobile
    if(isTablet){
      setFilterDrawerIsActive(true)
    }

    //if value is already in list -> remove
    if(subfilters.includes(value)){
      const filteredArray = subfilters.filter(item => item !== value)
      setSubFilters(filteredArray)

      // set number in the brackets in the sia button
      SetNumberOfActiveFilters(numberOfActiveFilters-1);
    }else{
      setSubFilters([...subfilters, value])

       // set number in the brackets in the sia button
       SetNumberOfActiveFilters(numberOfActiveFilters+1);
    }
  }

  const onChangePagination = (number: number) => {
    setPaginationNumber(number)
    router.push(`/?page=${number}`, undefined, { shallow: true })
  }

  const clearFilters = () => {
    setFilters({
      brand: [],
      companies: [],
      certificates: [],
      categories: [],
      certificateSystems:[]
    })
    setSubFilters([])
    setQuery("")
    SetNumberOfActiveFilters(0)
  }

  const getCompanyCounts = (comp : string) => { 
    var val = 0
    companyCounts.map(compcount => { 
      if(compcount.name === comp) {
        val = compcount.count
      }
    })
    return val
  }

  const setSessionStorageItems = () => {
    sessionStorage.setItem('level1Filters', JSON.stringify(filters))
    sessionStorage.setItem('level2Filters', JSON.stringify(subfilters))
    sessionStorage.setItem('queryParam', !!query ? query : '')
  }

  const getSessionStorageItems = () => {
    const level1Filters = sessionStorage.getItem('level1Filters')
    const level2Filters = sessionStorage.getItem('level2Filters')
    const queryFilter = sessionStorage.getItem('queryParam')

    //Scroll to searchPage if any sessionItems are present and open the filterBar
    if((level1Filters !== null && level1Filters !== JSON.stringify(filters))|| (level2Filters !== null && level2Filters !== JSON.stringify(subfilters))|| (queryFilter !== null && queryFilter !== '')){
      document.getElementById("search").scrollIntoView();
      setFilterDrawerIsActive(true)
      // isTablet does not work here, its always false
      // if(isTablet) {
      //   setFilterDrawerIsActive(false)
      // }
      if(window.innerWidth <= 760) {
        setFilterDrawerIsActive(false)
      }
    }

    if(level1Filters !== null && level1Filters !== JSON.stringify(filters)){
      setFilters(JSON.parse(level1Filters))
    }
    if(level2Filters !== null && level2Filters !== JSON.stringify(subfilters)){
      // console.log('level2filters', level2Filters)
      // setFilters(JSON.parse(level2Filters))
      setSubFilters(JSON.parse(level2Filters))
    }
    if(queryFilter !== null && queryFilter !== ''){
      setQuery(queryFilter)
    }
  }

  const getCertificateCounts = (cert) => { 
    var val = 0
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
      {filteredProductList.length === 0 && numberOfActiveFilters > 0 ?
        <> 
          <NoResultsSubtext> Þú leitaðir að </NoResultsSubtext> 
          <SearchResultSubtext> "{query.toUpperCase()}" </SearchResultSubtext>
        </>
        : <ProductCountText>{`${filteredProductList.length} af ${products.length}`}</ProductCountText>
      }
      <CategoryFilters>
        {isTablet ? <StyledFilterButton text='Sía' numberString={"("+numberOfActiveFilters+")"} onClick={() => setFilterDrawerIsActive(!filterDrawerIsActive)} active={filterDrawerIsActive} />
          : <StyledFilterButton text='Sía' onClick={() => setFilterDrawerIsActive(!filterDrawerIsActive)} active={filterDrawerIsActive} />}
        {VisttorgCategories.map(cat => {
          if(cat.weight == 1) {
            return(
              <StyledMainButton
                key={cat.name} 
                text={cat.name}
                onClick={() => {
                  toggleFilters('categories', cat)
                }} 
                active={filters.categories.filter(category=>category.name==cat.name).length>0} 
              />
            )
          }
        })}
      </CategoryFilters>
      {numberOfActiveFilters > 0 && filteredProductList.length !== 0 &&
        <ShowsizeWrapper>
          <StyledMainButton 
            text="20"
            onClick={() => SetPaginationPageSize(20)}
            active={paginationPageSize===20} />
          <StyledMainButton 
            text="40"
            onClick={() => SetPaginationPageSize(40)}
            active={paginationPageSize===40} />
          <StyledMainButton 
            text="60"
            onClick={() => SetPaginationPageSize(60)}
            active={paginationPageSize===60} />
        </ShowsizeWrapper>
      }
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
            <FilterGroupTitle>Vottunarkerfi</FilterGroupTitle>
            <FilterItems>
              {certificateSystems.map(certSystem => {
                return(
                  <FilterItem 
                    key={certSystem.name}
                    text={certSystem.name}
                    onClick={() => {
                      toggleFilters('certificateSystems', certSystem.name)
                    }} 
                    active={filters.certificateSystems.includes(certSystem.name)} 
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
                    text={certificateMapper[certificate.name]/*.toLowerCase()*/} 
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
            <FilterGroupTitle>Flokkar</FilterGroupTitle>
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
            {filters.categories.length !== 0 && <>
            <FilterGroupTitle>Undirflokkar</FilterGroupTitle>
            <FilterItems>
              {filters.categories.map(category => {
                return( category.subCategories.map(sub => {
                  return(
                    <FilterItem 
                      key={sub.name}
                      text={sub.name} 
                      onClick={() => {
                        toggleSubFilters(sub.name)
                      }} 
                      active={subfilters.includes(sub.name)}
                    />
                  )
                }))
                })
              }
            </FilterItems>
            </>}
          </FilterGroup>
            {!isTablet && 
              <StyledBottomFilterButton onClick={clearFilters} >
                <Close fill="#000"/> <StyledBottomFilterButtonText> Hreinsa síur </StyledBottomFilterButtonText>
              </StyledBottomFilterButton>
            }
        </FilterWrapper>
        {isTablet && 
          <MobileFilterButtonWrapper
            animate={fadeInControls}
          >
            <StyledBottomFilterButton onClick={() => setFilterDrawerIsActive(false)} >
              <MagnifyingGlass fill="#000"/> <StyledBottomFilterButtonText> Leita </StyledBottomFilterButtonText>
            </StyledBottomFilterButton> 
            <StyledBottomFilterButton onClick={clearFilters} >
              <Close fill="#000"/> <StyledBottomFilterButtonText> Hreinsa síur </StyledBottomFilterButtonText>
            </StyledBottomFilterButton>
          </MobileFilterButtonWrapper>
          
          }
        <ProductList>
          {filteredProductList.length === 0 && numberOfActiveFilters >= 0 &&
            <div>
              <ImageWrapper>
                <Image 
                  src={PaintBucket} 
                  alt='Icon image' 
                  layout='fill'
                  objectFit='contain'
                />
              </ImageWrapper>
              <NoResultsText>Úps! Ekkert fannst.</NoResultsText>
              <NoResultsSubtext>Endilega prófaðu að leita eftir öðrum leitarskilyrðum.</NoResultsSubtext>
            </div>
          }
          {numberOfActiveFilters === 0 && filteredProductList.length === products.length &&
            <div>
              <ImageWrapper>
                <Image 
                  src={PaintBucket} 
                  alt='Icon image' 
                  layout='fill'
                  objectFit='contain'
                />
              </ImageWrapper>
              <NoResultsText>Prófaðu að leita eða nota síuna til að fá upp vörur</NoResultsText>
            </div>
          }
          {(numberOfActiveFilters > 0 || filteredProductList.length !== products.length) &&  filteredProductList.map((product, index) => {
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
                  productCompany={thisProduct.sellingcompany.id}
                />
              )
            }else{

            }
          })}
        </ProductList>
      </ProductsAndFilter>
      {numberOfActiveFilters > 0 && filteredProductList.length !== 0 &&
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

const MobileFilterButtonWrapper = styled(motion.div)`
  position: fixed;
  bottom: 0;
  z-index: 10000;
  width: 100%;
  background: white;
  padding-right: 20px;
  padding-bottom: 10px;
  
`

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
      /*margin-bottom:8px;*/
    }
  }

  @media ${mediaMax.tablet}{
    height: 117px;
    /*flex-wrap: wrap;  
    justify-content: center;
    padding-bottom: 10px;*/
  }
`

const StyledBottomFilterButton = styled.button`
  padding: 8px 18px 10px;
  height: 33px;
  background: none;
  border-radius: 1284.43px;
  border:none;
  width: fit-content;
  min-width: fit-content;
  cursor:pointer;
  float: right;
`
const StyledBottomFilterButtonText = styled.span`
  font-family: Space Mono;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 104%;
  letter-spacing: 0.005em;
  padding-left: 10px;
`

const SearchResultSubtext = styled(Heading4)`
  font-family: Space Mono;
  text-align: center;
  padding-top: 20px;
`

const NoResultsText = styled(Heading3)`
  font-family: Space Mono;
  text-align: center;
  padding-top: 20px;
  max-width:700px;
`

const NoResultsSubtext = styled(Heading6)`
  text-align: center;
  padding-top: 20px;
  color: #BDBDBD;
`

const ImageWrapper = styled.div`
  max-height:100%;
  height: 25%;
  position:relative;
  @media ${mediaMax.tablet}{
    height:auto;
  }
`

const ShowsizeWrapper = styled.div`
  padding-bottom: 55px;
`
