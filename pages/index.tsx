import React, { useEffect, useState } from "react"
import { GetStaticProps } from "next"
import styled from 'styled-components'
import { prismaInstance } from '../lib/prisma'
import { ProductProps, Category } from '../types/products'
import { Certificate, ProductCertificate } from '../types/certificates'
import Head from 'next/head'
import Checkboxes from '../components/Inputs/checkboxes'
import Image from 'next/image'
import BykoLogoSvg from "../components/Svg/Logos/Byko"
import SvanurinnLogoSVG from '../components/Svg/Logos/Svanurinn'
import VocLogoSVG from '../components/Svg/Logos/Voc'
import BykoCertificateMapper from '../mappers/byko'
import { mediaMax } from '../constants/breakpoints'
import { motion, useAnimation } from "framer-motion"
import CloseIcon from '../components/Svg/Close'
import { Star } from '../components/Svg/Star'

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

  return { props: { productList, categories, certificates }}
}

type HomeProps = {
  productList: ProductProps[]
  categories: Category[]
  certificates : Certificate[]
}

interface CheckboxProps {
  keyer : string
  value : string
}

const Home = ({ productList, categories, certificates } : HomeProps) => {
  const [query, setQuery] = useState("");
  const [filteredList, setFilteredList] = useState<Array<ProductProps>>([])
  const [activeCategories, setActiveCategories] = useState<Array<string>>([])
  const [activeCertificates, setActiveCertificates] = useState<Array<string>>([])

  const [categoryOptions, setCategoryOptions] = useState<Array<CheckboxProps>>()
  const [certificateOptions, setCertificateOptions] = useState<Array<CheckboxProps>>()

  const [isTop, setIsTop] = useState(true)
  useEffect(() => {
    document.addEventListener("scroll", () => {
      const currentIsTop = window.scrollY < 1;
      if (currentIsTop !== isTop) {
        setIsTop(currentIsTop)
      }
    })
  })

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
  },[])
  
  useEffect(() => {
    if(query != ""){
      setFilteredList(productList.filter(product => product.title.toLowerCase().indexOf(query.toLowerCase()) != -1))
    }else{
      setFilteredList(productList)
    }
  }, [query])


  useEffect(() => {
    setFilteredList(productList.filter(product => {
      let found = false
      product.categories.map(category => {
        if(activeCategories.indexOf(category.name) > -1){
          found = true 
        } 
      })
      return found || activeCategories.length == 0
    }))
  },[activeCategories])


  useEffect(() => {
    setFilteredList(productList.filter(product => {
      let found = false
      product.certificates.map(certificate => {
        if(activeCertificates.indexOf(certificate.certificate.name) > -1){
          found = true 
        } 
      })
      return found || activeCertificates.length == 0
    }))
  },[activeCertificates])

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

  const addFavorites = (productid: string) => {
    const tmp = JSON.stringify([{ productId: 1}, { productId: 2}])
    localStorage.setItem('myFavorites', tmp)
  }

  const removeFavorites = (productid: string) => {
    const oldFavorites = JSON.parse(localStorage.getItem("names"))
    console.log(oldFavorites)
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
          <StyledInput type="text" onChange={value => setQuery(value.target.value)} placeholder="Leita eftir nafni vöru" className={!isTop ? 'onTheMove' : ''}/>
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
        {categoryOptions && <Checkboxes options={categoryOptions} title="Flokkar" setActiveOptions={setActiveCategories} activeOptions={activeCategories}/>}
        {certificateOptions && <Checkboxes options={certificateOptions} title="Vottanir" setActiveOptions={setActiveCertificates} activeOptions={activeCertificates}/>}
      </SideFilterMenu>
      <SideFilterOverlay className={showSideMenu ? 'active': ''} onClick={() => setShowSideMenu(false)}/>
      <StyledContainer>
        <StyledLeft>
          <FilterTop>
            <FilterTitle>Sía</FilterTitle>
            <FilterClearButton onClick={() => clearAllFilters()}>Hreinsa síu</FilterClearButton>
          </FilterTop>
          {categoryOptions && <Checkboxes options={categoryOptions} title="Flokkar" setActiveOptions={setActiveCategories} activeOptions={activeCategories}/>}
          {certificateOptions && <Checkboxes options={certificateOptions} title="Vottanir" setActiveOptions={setActiveCertificates} activeOptions={activeCertificates}/>}
        </StyledLeft>
        <StyledRight className={filteredList.length === 0 ? 'empty' : ''}>
          {filteredList && filteredList.map((product) => {
            //TODO BETTER !!
            const mappedCertificates = product.certificates.map(cert => cert.certificate.name)
            var filteredCertificates = [];
            mappedCertificates.forEach((item) => {
              if(filteredCertificates.indexOf(item) < 0) {
                filteredCertificates.push(item);
              }
            });
            return(
              <ProductResult key={product.id} href={`/product/${product.productid}`}>
                <StyledStar variant="outline"/>
                <ProductImage src={product.productimageurl} alt={`product image - ${product.title}`}/>
                <ContentWrapper>
                  <ProductTopContent>
                    <ProductInfo>
                      <ProductCategory>{product.categories.map((category : Category, index : number) => {
                          return (
                            <span key={`${product.title} - ${category.name}`}>{index === 0 ? category.name : ` / ${category.name}`}</span>
                          )
                        })}
                      </ProductCategory>
                    <ProductTitle>{product.title}</ProductTitle>
                    </ProductInfo>
                  </ProductTopContent>
                  <ProductCompanyLogoWrapper>
                    {product.sellingcompany.name === 'Byko' &&<BykoLogoSvg style={{ width: 'max(3.47vw, 50px)' }}/>}
                  </ProductCompanyLogoWrapper>
                  <ProductBottomContent>

                    <ProductCertificatesWrapper>{filteredCertificates.map((certificate : string) => {
                      if(certificate === 'EPD'){
                        return (
                          <CertificateImage key={`${product.id} - ${certificate}`} src="/EPD_LOGO.jpg" alt="EPD LOGO" style={{ width: 'max(3.47vw, 50px)'}}/>
                        )
                      }
                      if(certificate === 'FSC'){
                        return (
                          <CertificateImage key={`${product.id} - ${certificate}`} src="/FSC_LOGO.jpg" alt="FSC LOGO"/>
                        )
                      }
                      if(certificate === 'VOC'){
                        return (
                          <StyledVocLogo key={`${product.id} - ${certificate}`}/>
                        )
                      }
                      if(certificate === 'BREEAM'){
                        return (
                          <CertificateImage key={`${product.id} - ${certificate}`} src="/BREEAM_LOGO.png" alt="BREEAM LOGO" style={{ maxWidth: '30%' }}/>
                        )
                      }
                      if(certificate === 'SV'){
                        return (
                          <StyledSvanurinnLogo key={`${product.id} - ${certificate}`} />
                        )
                      }
                      if(certificate === 'SV_ALLOWED'){
                        return (
                          <CertificateImage key={`${product.id} - ${certificate}`} src="/leyfilegt-svansvottad.png" style={{ maxWidth: '40%' }}/>
                        )
                      }
                    })}</ProductCertificatesWrapper>
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

const StyledStar = styled(Star)`
  position:absolute;
  right:5px;
  top:5px;
  height:25px;
  width: 25px;
  z-index:8;
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
  align-items: center;
  padding-bottom:15px;
  border-bottom:1px solid #e3e3e3;
`

const FilterTitle = styled.h2`
  font-size:max(1.67vw, 24px);
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: 400;
`

const FilterClearButton = styled.button`
  font-size:max(1.25vw, 18px);
  color: ${({ theme }) => theme.colors.highlight};
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: 600;
  background-color:transparent;
  outline:none;
  border:none;
  cursor:pointer;
`

const ProductImage = styled.img`
  height: max(4.1vw, 60px);
  width: max(4.1vw, 60px);
  border-radius: 50%;
  object-fit: contain;
  background-color:white;
`

const StyledVocLogo = styled(VocLogoSVG)`
  margin-left:10px;
  max-height:100%;
`

const StyledSvanurinnLogo = styled(SvanurinnLogoSVG)`
  max-width:20%;
  margin-left:10px;
  max-height:100%;
`

const CertificateImage = styled.img`
  width: max(10%, 60px);
  margin-left:10px;
  object-fit:contain;
  max-height:100%;
`

const ProductCompanyLogoWrapper = styled.div`
  flex:1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position:absolute;
  left: 20px;
  bottom: 2px;
`

const ProductCertificatesWrapper = styled.div`
  flex:1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items:center;
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

const ProductCategory = styled.h3`
  font-size: max(0.9vw, 13px);
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  line-height:110%;
  margin-bottom:15px;
  font-weight: 400;
`

const ProductTopContent = styled.div`
  display:flex;
  flex-direction:row;
  margin-bottom:15px;
`

const ProductInfo = styled.div`
  display:flex;
  flex-direction:column;
  padding-left:15px;
`

const ProductBottomContent = styled.div`
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  height:30px;
`

const HeaderArea = styled.div`
  height: 100px;
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.colors.primary.base};
  position: fixed;
  z-index: 10;
  width: 100%;
  transform: all 0.1s ease-in;
  
  &.onTheMove{
    box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
    background-color:#fff;
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
  width:30vw;
  display: flex;
  flex-direction: column;
  padding: 0 20px;

  @media ${mediaMax.tablet}{
    display:none;
  }
`

const StyledRight = styled.div`
  width:70vw;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-radius:30px;
  padding: 10px;
  margin-right: 20px;
  
  @media ${mediaMax.tablet}{
    width: 100%;
  }
`

const StyledPage = styled.div`
  background-color: ${({ theme }) => theme.colors.primary.base};
  min-height: 100vh;
`

const ProductResult = styled.a`
  padding:5px;
  width:100%;
  padding: 20px 20px 10px 20px;
  background-color: ${({ theme }) => theme.colors.secondary.base};
  height: 140px;
  border-radius:30px;
  margin-bottom:15px;
  display:flex;
  flex-direction:row;
  position:relative;
`

const StyledInput = styled.input`
  border-radius: 30px;
  width:100%;
  height:100%;
  border:none;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  padding-right: max(9.7vw, 135px);
  padding-left:max(1.4vw, 20px);

  &.onTheMove{
    background-color: ${({ theme }) => theme.colors.primary.base};

    &::placeholder{
      color:white;
    }
  }
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
  border-radius: 30px;
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