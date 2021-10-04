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

  const clearAllFilters = () => {
    setActiveCategories([])
    setActiveCertificates([])
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


  return (
    <StyledPage>
      <Head>
        <title>VistTorg</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <HeaderArea>
        <Logo src="/Vistbók-07.png" alt="Vistbók logo" />
        <InputWrapper>
          <StyledInput type="text" onChange={value => setQuery(value.target.value)} placeholder="Leita eftir nafni vöru"/>
          <InputSubmitButton>Leita</InputSubmitButton>
        </InputWrapper>
      </HeaderArea>
      <StyledContainer>
        <StyledLeft>
          <FilterTop>
            <FilterTitle>Sía</FilterTitle>
            {/* <FilterClearButton onClick={() => clearAllFilters()}>Hreinsa síu</FilterClearButton> */}
          </FilterTop>
          {categoryOptions && <Checkboxes options={categoryOptions} title="Flokkar" setActiveOptions={setActiveCategories} activeOptions={activeCategories}/>}
          {certificateOptions && <Checkboxes options={certificateOptions} title="Vottanir" setActiveOptions={setActiveCertificates} activeOptions={activeCertificates}/>}
        </StyledLeft>
        <StyledRight>
          {filteredList && filteredList.map((product) => {
            //TODO BETTER !!
            const mappedCertificates = product.certificates.map(cert => cert.certificate.name )
            var filteredCertificates = [];
            mappedCertificates.forEach((item) => {
              if(filteredCertificates.indexOf(item) < 0) {
                filteredCertificates.push(item);
              }
            });
            return(
              <ProductResult key={product.id} href={`/product/${product.productid}`}>
                <ContentWrapper>
                  <ProductTopContent>
                    <ProductImage src={product.productimageurl} alt={`product image - ${product.title}`}/>
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
                  <ProductBottomContent>
                    <ProductCompanyLogoWrapper>
                      {product.sellingcompany.name === 'Byko' &&<BykoLogoSvg style={{ width: 'max(3.47vw, 50px)' }}/>}
                    </ProductCompanyLogoWrapper>

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
        </StyledRight>
      </StyledContainer>
    </StyledPage>
  )
}

export default Home

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
  height: max(5.55vw, 80px);
  width: max(5.55vw, 80px);
  border-radius: 50%;
  object-fit: contain;
  background-color:white;
`

const StyledVocLogo = styled(VocLogoSVG)`
  min-width:20%;
  max-width:20%;
  margin-left:10px;
`

const StyledSvanurinnLogo = styled(SvanurinnLogoSVG)`
  max-width:20%;
  margin-left:10px;
`

const CertificateImage = styled.img`
  max-width: 20%;
  margin-left:10px;
`

const ProductCompanyLogoWrapper = styled.div`
  flex:1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
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
`

const HeaderArea = styled.div`
  height: 170px;
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
`

const Logo = styled.img`
  height:170px;
`

const ContentWrapper = styled.div`
  padding: 20px 20px 10px 20px;
  background-color: ${({ theme }) => theme.colors.secondary.base};
  min-height:200px;
  display: flex;
  flex-direction: column;
  border-radius:30px;
  justify-content: space-between;
`

const StyledContainer = styled.div`
  display:flex;
`

const StyledLeft = styled.div`
  width:30vw;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`

const StyledRight = styled.div`
  width:70vw;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #fff;
  border-radius:30px;
  padding: 10px;
  margin-right: 20px;
`

const StyledPage = styled.div`
  background-color: ${({ theme }) => theme.colors.primary.base};
`

const ProductResult = styled.a`
  padding:5px;
  width:50%;
  

  @media(max-width: 1200px){
    width: 100%;
  }
`

const StyledInput = styled.input`
  border-radius: 30px;
  width:100%;
  height:100%;
  border:none;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  padding-right: max(9.7vw, 135px);
  padding-left:max(1.4vw, 20px);
`

const InputWrapper = styled.div`
  height:60px;
  width:max(60vw, 250px);
  position:relative;
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
`