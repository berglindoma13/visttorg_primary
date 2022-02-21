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
import Close from '../Svg/Close'
import certificateMapper from '../../mappers/certificates'
interface SearchPageProps{
  products: Array<ProductProps>
  certificates : Array<Certificate>
  companies: Array<Company>
}

interface FilterProps{
  brand: Array<string>
  companies: Array<string>
  certificates: Array<string>
  categories: Array<string>
}

export const SearchPage = ({ products = [], certificates, companies }: SearchPageProps) => {
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

    //if no filters are active, then show all products
    if(!query && filters.categories.length === 0 && filters.certificates.length === 0 && filters.companies.length === 0){
      resetFilteredProductList()
    }else{
      const results = SearchProducts({
        fuseInstance, 
        query, 
        activeCategories: filters.categories, 
        activeCertificates: filters.certificates, 
        activeCompanies: filters.companies
      })
      setFilteredProductList(results)
    }
  }, [filters, query])

  const toggleFilters = (filter: string, value: string) => {

    //close drawer on filterToggle in tablet and mobile
    if(isTablet){
      setFilterDrawerIsActive(false)
    }

    //if value is already in list -> remove
    if(filters[filter].includes(value)){
      const filteredArray = filters[filter].filter(item => item !== value)
      setFilters({...filters, [filter]: filteredArray})
    }else{
      setFilters({...filters, [filter]: [...filters[filter], value ]})
    }
  }

  const onChangePagination = (number: number) => {
    setPaginationNumber(number)
    router.push(`/?page=${number}`, undefined, { shallow: true })
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
        placeholder='Leitaðu eftir nafni vöru' 
        onChange={(input) => {
          setQuery(input.target.value)
        }}
        onSubmit={() => {}}
        value={query}
      />

      <ProductCountText>{`${filteredProductList.length} af ${products.length}`}</ProductCountText>
      <CategoryFilters>
        <StyledFilterButton text='Sía' onClick={() => setFilterDrawerIsActive(!filterDrawerIsActive)} active={filterDrawerIsActive} />
        {/* <MainButton text='Baðherbergi' onClick={() => {toggleFilters('categories', 'Baðherbergi')}} active={false} /> */}
        <StyledMainButton 
          text='Lýsing og rafmagn' 
          onClick={() => {
            toggleFilters('categories', 'Lýsing og rafmagn')
          }} 
          active={filters.categories.includes('Lýsing og rafmagn')} 
        />
        <StyledMainButton 
          text='Eldhús' 
          onClick={() => {
            toggleFilters('categories', 'Eldhús')
          }} 
          active={filters.categories.includes('Eldhús')} 
        />
        <StyledMainButton 
          text='Baðherbergi' 
          onClick={() => {
            toggleFilters('categories', 'Baðherbergi')
          }} 
          active={filters.categories.includes('Baðherbergi')} 
        />
        <StyledMainButton 
          text='Gólfefni' 
          onClick={() => {
            toggleFilters('categories', 'Gólfefni')
          }} 
          active={filters.categories.includes('Gólfefni')} 
        />
        <StyledMainButton 
          text='Garðurinn' 
          onClick={() => {
            toggleFilters('categories', 'Garðurinn')
          }} 
          active={filters.categories.includes('Garðurinn')} 
        />
        <StyledMainButton
          text='Gluggar' 
          onClick={() => {
            toggleFilters('categories', 'Gluggar')
          }} 
          active={filters.categories.includes('Gluggar')} 
        />
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
              <FilterItem 
                key='Burðavirki'
                text='Burðavirki' 
                onClick={() => {
                  toggleFilters('categories', 'Burðavirki')
                }} 
                active={filters.categories.includes('Burðavirki')}
              />
              <FilterItem 
                key='Burðavirki'
                text='Burðavirki' 
                onClick={() => {
                  toggleFilters('categories', 'Burðavirki')
                }} 
                active={filters.categories.includes('Burðavirki')}
              />
              <FilterItem 
                key='Loftaefni'
                text='Loftaefni' 
                onClick={() => {
                  toggleFilters('categories', 'Loftaefni')
                }} 
                active={filters.categories.includes('Loftaefni')}
              />
              <FilterItem 
                key='Hurðir'
                text='Hurðir' 
                onClick={() => {
                  toggleFilters('categories', 'Hurðir')
                }} 
                active={filters.categories.includes('Hurðir')}
              />
              <FilterItem 
                key='Lagnir'
                text='Lagnir' 
                onClick={() => {
                  toggleFilters('categories', 'Lagnir')
                }} 
                active={filters.categories.includes('Lagnir')}
              />
              <FilterItem 
                key='Textíll'
                text='Textíll' 
                onClick={() => {
                  toggleFilters('categories', 'Textíll')
                }} 
                active={filters.categories.includes('Textíll')}
              />
              <FilterItem 
                key='Lyftur'
                text='Lyftur' 
                onClick={() => {
                  toggleFilters('categories', 'Lyftur')
                }} 
                active={filters.categories.includes('Lyftur')}
              />
              <FilterItem 
                key='Öryggi og merkingar'
                text='Öryggi og merkingar' 
                onClick={() => {
                  toggleFilters('categories', 'Öryggi og merkingar')
                }} 
                active={filters.categories.includes('Öryggi og merkingar')}
              />
              <FilterItem 
                key='Vélbúnaður'
                text='Vélbúnaður' 
                onClick={() => {
                  toggleFilters('categories', 'Vélbúnaður')
                }} 
                active={filters.categories.includes('Vélbúnaður')}
              />
              <FilterItem 
                key='Húsgögn'
                text='Húsgögn' 
                onClick={() => {
                  toggleFilters('categories', 'Húsgögn')
                }} 
                active={filters.categories.includes('Húsgögn')}
              />
              <FilterItem 
                key='Heimilistæki'
                text='Heimilistæki' 
                onClick={() => {
                  toggleFilters('categories', 'Heimilistæki')
                }} 
                active={filters.categories.includes('Heimilistæki')}
              />
              <FilterItem 
                key='Veggir'
                text='Veggir' 
                onClick={() => {
                  toggleFilters('categories', 'Veggir')
                }} 
                active={filters.categories.includes('Veggir')} 
              />
              <FilterItem 
                key='Málningarvörur'
                text='Málningarvörur' 
                onClick={() => {
                  toggleFilters('categories', 'Málningarvörur')
                }} 
                active={filters.categories.includes('Málningarvörur')} 
              />
            </FilterItems>
          </FilterGroup>
        </FilterWrapper>
        <ProductList>
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
      <Pagination 
        currentPage={paginationNumber}
        setCurrentPage={onChangePagination}
        queryParamName='productPage'
        total={filteredProductList.length}
        pageSize={paginationPageSize}
      />
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