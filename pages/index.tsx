import React, { useEffect, useState } from "react"
import { GetStaticProps } from "next"
import styled from 'styled-components'
import prisma from '../lib/prisma'
import { ProductProps, Category } from '../types/products'
import { Certificate, ProductCertificate } from '../types/certificates'
import Head from 'next/head'
import Checkboxes from '../components/Inputs/checkboxes'
import Image from 'next/image'

export const getStaticProps: GetStaticProps = async () => {

  const productList = await prisma.product.findMany({
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

  const categories = await prisma.category.findMany()
  const certificates = await prisma.certificate.findMany()

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

  const handleCategoryChange = (value : string) => {
    console.log("toggling category")
  }

  const handleCertificateChange = (value : string) => {
    console.log("toggling certificate")
  }

  useEffect(() => {
    setCategoryOptions(categories.map(cat => {
      const keyvalue = { keyer : cat.name, value: cat.name }
      return keyvalue
    }))

    setCertificateOptions(certificates.map(cat => {
      const keyvalue = { keyer : cat.name, value: cat.name }
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
      <BackgroundImage src="/alex-_ZfLlKxilpw-unsplash.jpg" alt="Background picture"/>
      <StyledForm>
        <StyledInput type="text" onChange={value => setQuery(value.target.value)} placeholder="Leita eftir nafni vöru"/>
      </StyledForm>
      <StyledContainer>
        <StyledLeft>
          {categoryOptions && <Checkboxes options={categoryOptions} title="Flokkar" setActiveOptions={setActiveCategories} activeOptions={activeCategories}/>}
          {certificateOptions && <Checkboxes options={certificateOptions} title="Vottanir" setActiveOptions={setActiveCertificates} activeOptions={activeCertificates}/>}
        </StyledLeft>
        <StyledRight>
          {filteredList && filteredList.map((product, index) => {
            return(
              <ProductResult key={index} href={`/product/${product.productid}`}>
                <ContentWrapper>
                  <Image src={product.productimageurl} alt={`product image - ${product.title}`} height="100%" width="100%"/>
                  <ProductTextItem><ProductTextBold>Nafn:</ProductTextBold><ProductText>{product.title}</ProductText></ProductTextItem>
                  <ProductTextItem><ProductTextBold>Vörumerki: </ProductTextBold><ProductText>{product.brand}</ProductText></ProductTextItem>
                  <ProductTextItem><ProductTextBold>Flokkar:</ProductTextBold><ProductText>{product.categories.map((category : Category, index : number) => {
                    return (
                      <span key={index}>{index === 0 ? category.name : `, ${category.name}`}</span>
                    )
                  })}</ProductText></ProductTextItem>
                  <ProductTextItem><ProductTextBold>Vottanir:</ProductTextBold><ProductText>{product.certificates.map((certificate : ProductCertificate, index : number) => {
                    return (
                      <span key={index}>{index === 0 ? certificate.certificate.name : `, ${certificate.certificate.name}`}</span>
                    )
                  })}</ProductText></ProductTextItem>
                  <ProductTextItem><ProductTextBold>Stutt lýsing:</ProductTextBold><ProductDescription dangerouslySetInnerHTML={{ __html: product.shortdescription }}/></ProductTextItem>
                  <ProductTextItem><ProductTextBold>Fyrirtæki:</ProductTextBold><ProductText>{product.sellingcompany.name}</ProductText></ProductTextItem>
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

const ContentWrapper = styled.div`
  background-color: rgba(255,255,255, 0.5);
  padding:20px;
`

const ProductTextBold = styled.p`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: bold;
  margin-right:5px;
`

const ProductText = styled.p`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
`

const ProductDescription = styled.div`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
`

const ProductTextItem = styled.div`
  display:flex;
`

const BackgroundImage = styled.img`
  position: fixed;
  width:100vw;
  height:100vh;
  object-fit: cover;
  top:0;
  left:0;
  z-index: -1;
`

const StyledContainer = styled.div`
  display:flex;
`

const StyledLeft = styled.div`
  width:20%;
  display: flex;
  flex-direction: column;
`

const StyledRight = styled.div`
  width:80%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const StyledPage = styled.div`
  padding: 40px 15px;
`

const ProductResult = styled.a`
  padding:10px;
  width:32%;

  @media(max-width: 1200px){
    width: 50%;
  }
`

const StyledForm = styled.div`
  width:100vw;
  display:flex;
  flex-direction:row;
  justify-content:center;
`

const StyledInput = styled.input`
  height:50px;
  padding-left:20px;
  width:50vw;
  margin-bottom:20px;
`