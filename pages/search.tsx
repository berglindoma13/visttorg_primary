import React, { useEffect, useState } from "react"
import { GetStaticProps } from "next"
import styled from 'styled-components'
import { prismaInstance } from '../lib/prisma'
import { ProductProps, Category, Company } from '../types/products'
import { Certificate, ProductCertificate } from '../types/certificates'
import Head from 'next/head'
import Checkboxes from '../components/Inputs/checkboxes'
import BykoCertificateMapper from '../server/mappers/certificates/byko'
import { mediaMax } from '../constants/breakpoints'
import { motion, useAnimation } from "framer-motion"
import CloseIcon from '../components/Svg/Close'
import { Star } from '../components/Svg/Star'
import Fuse from 'fuse.js'
import { SearchProducts } from "../utils/Search"
import { useRouter } from "next/router"

export const getStaticProps: GetStaticProps = async () => {

  const productList = await prismaInstance.product.findMany({
    include: {
      sellingcompany: true,
      categories : true,
      certificates: {
        include: {
          certificate : true
        }
      }
    },
  });

  const categories = await prismaInstance.category.findMany()
  const certificates = await prismaInstance.certificate.findMany()
  const companies = await prismaInstance.company.findMany()

  const categoryCounts = []
  categories.map(cat => {
    const filteredList = productList.filter(product => {
      const matched = product.categories.filter(prodCat => prodCat.name === cat.name)
      return matched.length > 0
    })
    categoryCounts.push({ name: cat.name, count: filteredList.length})
  })

  const certificateCounts = []
  certificates.map(cert => {
    const filteredList = productList.filter(product => {
      const matched = product.certificates.filter(prodCat => {
        return prodCat.certificate.name === cert.name
      })
      return matched.length > 0
    })
    certificateCounts.push({ name: BykoCertificateMapper[cert.name], count: filteredList.length})
  })

  const companyCounts = []
  companies.map(comp => {
    const filteredList = productList.filter(product => {
      return product.sellingcompany.name === comp.name
    })
    companyCounts.push({ name: comp.name, count: filteredList.length})
  })

  return { props: { productList, categories, certificates, companies, categoryCounts, certificateCounts, companyCounts }}
}

interface Counter {
  name: string
  count: number
}

type HomeProps = {
  productList: ProductProps[]
  categories: Category[]
  certificates : Certificate[]
  companies: Company[]
  categoryCounts: Array<Counter>
  certificateCounts: Array<Counter>
  companyCounts: Array<Counter>
}
interface CheckboxProps {
  keyer : string
  value : string
}

const Home = ({ productList, categories, certificates, companies, categoryCounts, certificateCounts, companyCounts } : HomeProps) => {
  const [query, setQuery] = useState("");
  const [filteredList, setFilteredList] = useState<Fuse.FuseResult<ProductProps>[]>([])
  const [activeCategories, setActiveCategories] = useState<Array<string>>([])
  const [activeCertificates, setActiveCertificates] = useState<Array<string>>([])
  const [activeCompanies, setActiveCompanies] = useState<Array<string>>([])
  
  const [categoryOptions, setCategoryOptions] = useState<Array<CheckboxProps>>()
  const [certificateOptions, setCertificateOptions] = useState<Array<CheckboxProps>>()
  const [companyOptions, setCompanyOptions] = useState<Array<CheckboxProps>>()
  const [favorites, setFavorites] = useState<Array<string>>([])
  const router = useRouter()

  const [isTop, setIsTop] = useState(true)

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const currentIsTop = window.scrollY < 1;
      if (currentIsTop !== isTop) {
        setIsTop(currentIsTop)
      }
    })
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
  

  const fuseText = new Fuse(productList, options)

  const clearAllFilters = () => {
    setActiveCategories([])
    setActiveCertificates([])
    const checkboxes = document.getElementsByClassName("checkbox") as HTMLCollectionOf<HTMLInputElement>
    for(var i = 0; i < checkboxes.length; i++){
      checkboxes[i].checked = false
    }
  }

  useEffect(() => {
    setCategoryOptions(categories.map(cat => {
      const keyvalue = { keyer : cat.name, value: cat.name }
      return keyvalue
    }))

    setCertificateOptions(certificates.map(cat => {
      const keyvalue = { keyer : BykoCertificateMapper[cat.name], value: cat.name }
      return keyvalue
    }))

    setCompanyOptions(companies.map(company => {
      const keyvalue = { keyer : company.name, value: company.name }
      return keyvalue
    }))

    //populate favorites array
    const getArray = JSON.parse(localStorage.getItem('myFavorites') || '0')
    if(getArray !== 0){
      setFavorites([...getArray])
    }

  },[])

  useEffect(() => {
    console.log('running this')
    if(!query && activeCategories.length === 0 && activeCertificates.length === 0 && activeCompanies.length === 0){
      const resultProducts: Fuse.FuseResult<ProductProps>[] = productList.map((product, index) => {
        return { item : product, refIndex: index, score: 1}
      })
      setFilteredList(resultProducts)
    }else{
      const results = SearchProducts({fuseInstance: fuseText, query, activeCategories, activeCertificates, activeCompanies})
      setFilteredList(results)
    }
  }, [query, activeCategories, activeCertificates, activeCompanies])

  useEffect(() => {
    const urlQuery: string = router.query['query'] as string
    if(urlQuery){
      setQuery(urlQuery)
    }
  }, [router])

  const [showSideMenu, setShowSideMenu] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    if(showSideMenu){
      controls.start({
        x: "0%",
      })
    }

    else if(!showSideMenu){
      controls.start({
        x: "-120%",
      })
    }
  }, [showSideMenu])

  const addDeleteFavorites = (productid: string) => {
    let array = favorites
    let addArray = true
    array.map((item: any, key: number) => {
      //if the item is in the array then reomve it
      if(item === productid){
        array.splice(key,1)
        addArray = false
      }
    })

    if(addArray){
      array.push(productid)
    }

    setFavorites([...array])
    localStorage.setItem('myFavorites', JSON.stringify(favorites))
  }

  return (
    <StyledPage>
      <Head>
        <title>VistTorg</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <HeaderArea className={!isTop ? 'onTheMove' : ''}>
        <Logo src="/Vistbók-07.png" alt="Vistbók logo" />
        <InputWrapper>
          <StyledInput type="text" onChange={value => setQuery(value.target.value)} placeholder="Leita eftir nafni vöru" className={!isTop ? 'onTheMove' : ''} value={router.query['query'] ? router.query['query'] : ""}/>
          <InputSubmitButton>Leita</InputSubmitButton>
        </InputWrapper>
      </HeaderArea>
      <SideFilterButton onClick={() => setShowSideMenu(!showSideMenu)}>Opna síu</SideFilterButton>
      <SideFilterMenu
        animate={controls}
        initial={{x : '-120%'}}
        transition={{ type: "Tween" }}
      >
        <StyledCloseIcon stroke="#fff" onClick={() => setShowSideMenu(false)}/>
        <FilterTop>
          <FilterTitle>Sía</FilterTitle>
          <FilterClearButton onClick={() => clearAllFilters()}>Hreinsa síu</FilterClearButton>
        </FilterTop>
        {categoryOptions && <Checkboxes options={categoryOptions} title="Flokkar" setActiveOptions={setActiveCategories} activeOptions={activeCategories} counters={categoryCounts}/>}
        {certificateOptions && <Checkboxes options={certificateOptions} title="Vottanir" setActiveOptions={setActiveCertificates} activeOptions={activeCertificates} counters={certificateCounts} />}
        {companyOptions && <Checkboxes options={companyOptions} title="Birgjar" setActiveOptions={setActiveCompanies} activeOptions={activeCompanies} counters={companyCounts} />}
      </SideFilterMenu>
      <SideFilterOverlay className={showSideMenu ? 'active': ''} onClick={() => setShowSideMenu(false)}/>
      <StyledContainer>
        <StyledLeft>
          <FilterTop>
            <FilterTitle>Sía</FilterTitle>
            <FilterClearButton onClick={() => clearAllFilters()}>Hreinsa síu</FilterClearButton>
          </FilterTop>
          {categoryOptions && <Checkboxes options={categoryOptions} title="Flokkar" setActiveOptions={setActiveCategories} activeOptions={activeCategories} counters={categoryCounts}/>}
          {certificateOptions && <Checkboxes options={certificateOptions} title="Vottanir" setActiveOptions={setActiveCertificates} activeOptions={activeCertificates} counters={certificateCounts} />}
          {companyOptions && <Checkboxes options={companyOptions} title="Birgjar" setActiveOptions={setActiveCompanies} activeOptions={activeCompanies} counters={companyCounts} />}
        </StyledLeft>
        <StyledRight className={filteredList.length === 0 ? 'empty' : ''}>
          {filteredList && filteredList.map((resultItem : Fuse.FuseResult<ProductProps>) => {
            
            const product = resultItem.item

            const mappedCertificates = product.certificates.map(cert => cert.certificate.name)
            var filteredCertificates = [];
            mappedCertificates.forEach((item) => {
              if(filteredCertificates.indexOf(item) < 0) {
                filteredCertificates.push(item);
              }
            });
            return(
              <ProductResult key={product.id} href={`/product/${product.productid}`}>
                <StarButton onClick={(e) => {
                  e.preventDefault()
                  addDeleteFavorites(product.productid)}}
                >
                  <StyledStar variant={favorites.includes(product.productid) ? 'fill' : 'outline'}/>
                </StarButton>
                <ContentWrapper>
                  <ProductTopContent>
                    <ProductCompany>
                      {product.sellingcompany.name}
                    </ProductCompany>
                    <ProductImage src={product.productimageurl} alt={`product image - ${product.title}`}/>
                    <ProductInfo>
                    <ProductTitle>{product.title}</ProductTitle>
                    </ProductInfo>
                  </ProductTopContent>
                  <ProductBottomContent>
                    <ProductTagsWrapper>
                      {filteredCertificates.map((certificate : string) => {
                        return (
                          <ProductTag key={certificate}>{BykoCertificateMapper[certificate]}</ProductTag>
                        )})
                      }
                      {product.categories.map((category : Category, index : number) => {
                        return (
                          <ProductTag key={category.name}>{category.name}</ProductTag>
                        )
                       })}
                    </ProductTagsWrapper>
                  </ProductBottomContent>
                </ContentWrapper>
              </ProductResult>
            )
          })}
          {filteredList.length === 0 && (
            <NoResults>Engar vörur fundust</NoResults>
          )}
        </StyledRight>
      </StyledContainer>
    </StyledPage>
  )
}

export default Home

const StarButton = styled.button`
  position:absolute;
  right:10px;
  top:10px;
  border:none;
  background:none;
  display:flex;
  flex-direction:row;
  justify-content: center;
  align-items: center;
  z-index:8;
  cursor:pointer;
`

const StyledStar = styled(Star)`
  height:25px;
  width: 25px;
`

const StyledCloseIcon = styled(CloseIcon)`
  height: 35px;
  width: 35px;
  position: absolute;
  right: -45px;
  top: 20px;
  cursor:pointer;
`

const SideFilterMenu = styled(motion.div)`
  height: 100vh;
  width: 70vw;
  background-color:white;
  display:none;
  position:absolute;
  z-index:12;
  box-shadow: 6px 1px 13px 0px rgb(12 12 12 / 75%);
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  flex-direction: column;
  padding: 20px;
  background-color: rgba(33, 51, 59,0.9);

  @media ${mediaMax.tablet}{
    display:flex;
  }
`

const SideFilterOverlay = styled.div`
  width:100%;
  height:100vh;
  position:fixed;
  background-color: rgba(0,0,0,0.5);
  opacity:0;
  pointer-events:none;
  z-index:11;

  &.active{
    pointer-events:auto;
    opacity: 1;
  }
`

const SideFilterButton = styled.button`
  position: fixed;
  top: 155px;
  right: 0;
  width: max(20vw,160px);
  background-color: ${({ theme }) => theme.colors.highlight};
  height: 40px;
  z-index: 10;
  border: none;
  font-size:max(0.97vw, 14px);
  color: #000;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: 400;
  cursor:pointer;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  display:none;

  @media ${mediaMax.tablet}{
    display:block;
  }
`

const NoResults = styled.div`
  width: 100%;
  font-size: max(1.52vw, 22px);
  text-align: center;
  padding-top: 20px;
  color: white;
`

const FilterTop = styled.div`
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom:15px;
  border-bottom:1px solid #e3e3e3;
`

const FilterTitle = styled.h2`
  font-size:max(1.27vw, 22px);
  color: #3e3e3e;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: 400;
`

const FilterClearButton = styled.button`
  font-size:max(1.1vw, 16px);
  color: ${({ theme }) => theme.colors.secondary.base};
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: 600;
  background-color:transparent;
  outline:none;
  border:none;
  cursor:pointer;

  &:hover{
    text-decoration:underline;
  }
`

const ProductTag = styled.div`
  background-color:#fff;
  border: 1px solid #e3e3e3;
  padding: 5px 10px;
  font-size: max(0.5vw, 11px);
  margin-left:3px;
  box-shadow:0 0 10px rgb(0 0 0 / 60%);
  border-radius:30px;
  margin-bottom: 10px;
`

const ProductImage = styled.img`
  height: 200px;
  width: 100%;
  object-fit: cover;
`

const ProductTagsWrapper = styled.div`
  flex:1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items:center;
  flex-wrap:wrap;
`

const ProductTitle = styled.h2`
  font-size: max(1.67vw, 24px);
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  line-height:120%;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`

const ProductCompany = styled.h3`
  font-size: max(0.9vw, 13px);
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  line-height:110%;
  font-weight: 400;
  padding-bottom:10px;
`

const ProductTopContent = styled.div`
  display:flex;
  flex-direction:column;
  margin-bottom:15px;
`

const ProductInfo = styled.div`
  display:flex;
  flex-direction:column;
  padding-top:15px;
`

const ProductBottomContent = styled.div`
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  flex-wrap:wrap;
  width: 100%;
`

const HeaderArea = styled.div`
  height: 100px;
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #EAE7DC;
  position: fixed;
  z-index: 10;
  width: 100%;
  transform: all 0.1s ease-in;
  
  &.onTheMove{
    box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
    background-color: ${({ theme }) => theme.colors.primary.base};
    transform: all 0.1s ease-in;
  }

  @media ${mediaMax.tablet}{
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 150px;
  }
`

const Logo = styled.img`
  width: min(max(20vw, 100px), 200px);

  @media ${mediaMax.tablet}{
    margin-bottom:25px;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex:1;
`

const StyledContainer = styled.div`
  display:flex;
  padding-top:100px;

  @media ${mediaMax.tablet}{
    padding-top:200px;
  }
`

const StyledLeft = styled.div`
  width:min(30vw, 300px);
  display: flex;
  flex-direction: column;
  padding: 0 20px;

  @media ${mediaMax.tablet}{
    display:none;
  }
`

const StyledRight = styled.div`
  width:100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-radius:30px;
  padding: 10px;
  margin-right: 20px;
  justify-content: space-between;
  
  @media ${mediaMax.tablet}{
    width: 100%;
    margin-right:0;
    margin-left:0;
  }

`

const StyledPage = styled.div`
  /* background-color: ${({ theme }) => theme.colors.primary.base}; */
  min-height: 100vh;
  background-color: #EAE7DC;
`

const ProductResult = styled.a`
  padding:5px;
  width:32%;
  padding: 20px 30px 10px 30px;
  background-color: ${({ theme }) => theme.colors.primary.base};
  border-radius:5px;
  margin-bottom:15px;
  display:flex;
  flex-direction:row;
  position:relative;

  @media ${mediaMax.tabletL}{
    width:100%;
  }
`

const StyledInput = styled.input`
  border-radius: 5px;
  width:100%;
  height:100%;
  border:none;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  padding-right: max(9.7vw, 135px);
  padding-left:max(1.4vw, 20px);
  border: 1px solid #e3e3e3;
`

const InputWrapper = styled.div`
  height:60px;
  width:max(60vw, 250px);
  position:relative;

  @media ${mediaMax.tablet}{
    width: 100%;
  }
`

const InputSubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.highlight};;
  border-radius: 5px;
  position: absolute;
  width: max(9.7vw,135px);
  outline: none;
  border: none;
  height: 54px;
  top: 3px;
  right: 3px;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-size:max(0.97vw, 14px);
`