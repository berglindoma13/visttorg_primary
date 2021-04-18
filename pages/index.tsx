import React, { useEffect, useState } from "react"
import { GetStaticProps } from "next"
import styled from 'styled-components'
import prisma from '../lib/prisma'
import { ProductProps, Company, Category } from '../types/products'
import { ProductCertificate } from '../types/certificates'
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
  return { props: { productList }}
}

type HomeProps = {
  productList: ProductProps[]
}

const MockCategories = [
  { keyer: 'Annað', value: 'Annað'},
  { keyer: 'Steypa', value: 'Steypa'}
]

const MockCertificateList = [
  { keyer: 'VOC', value: 'VOC'},
  { keyer: 'FSC', value: 'FSC'},
  { keyer: 'EPD', value: 'EPD'}
]


const Home = ({ productList } : HomeProps) => {
  const [query, setQuery] = useState("");
  const [filteredList, setFilteredList] = useState<Array<ProductProps>>([])
  const [activeCategories, setActiveCategories] = useState<Array<string>>([])
  const [activeCertificates, setActiveCertificates] = useState<Array<string>>([])

  const handleCategoryChange = (value : string) => {
    console.log("toggling category")
  }

  const handleCertificateChange = (value : string) => {
    console.log("toggling certificate")
  }
  
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StyledForm>
        <StyledInput type="text" onChange={value => setQuery(value.target.value)} placeholder="Leita eftir nafni vöru"/>
      </StyledForm>
      <StyledContainer>
        <StyledLeft>
          <Checkboxes options={MockCategories} title="Flokkar" setActiveOptions={setActiveCategories} activeOptions={activeCategories}/>
          <Checkboxes options={MockCertificateList} title="Vottanir" setActiveOptions={setActiveCertificates} activeOptions={activeCertificates}/>
        </StyledLeft>
        <StyledRight>
          {filteredList.map((product, index) => {
            return(
              <ProductResult key={index}>
                <Image src={product.productimageurl} alt={`product image - ${product.title}`} height="100%" width="100%"/>
                <p>Nafn: {product.title}</p>
                <p>Vörumerki: {product.brand}</p>
                <p>Flokkar: {product.categories.map((category : Category, index : number) => {
                  return (
                    <span key={index}>{category.name}</span>
                  )
                })}</p>
                <p>Vottanir: {product.certificates.map((certificate : ProductCertificate, index : number) => {
                  return (
                    <span key={index}>{certificate.certificate.name}, </span>
                  )
                })}</p>
                <p>Löng lýsing: {product.description}</p>
                <p>Stutt lýsing: {product.shortdescription}</p>
                <p>Fyrirtæki: {product.sellingcompany.name}</p>
                <p>Slóð: <a target="_blank" href={product.url}>{product.url}</a></p>
              </ProductResult>
            )
          })}
        </StyledRight>
      </StyledContainer>
    </StyledPage>
  )
}

export default Home

const StyledContainer = styled.div`
  display:flex;
`

const StyledLeft = styled.div`
  width:20%;
`

const StyledRight = styled.div`
  width:80%
`

const StyledPage = styled.div`
  padding: 40px 15px;
`

const ProductResult = styled.div`
  margin: 10px 0;
  border: 1px solid black;
  padding:20px;
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