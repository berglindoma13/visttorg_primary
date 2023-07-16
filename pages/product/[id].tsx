import { GetServerSideProps } from "next"
import { prismaInstance } from '../../lib/prisma'
import { ProductProps, Company, Category } from '../../types/products'
import styled from 'styled-components'
import Image from 'next/image'
import { Certificate, ProductCertificate } from "../../types/certificates"
import certificateMapper from '../../mappers/certificates'
import { Footer } from "../../components/Footer"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css'
import SwiperCore, { Pagination } from 'swiper';
import { Header } from "../../components/Header"
import { Tag } from "../../components/Tag"
import { Heading1, Heading3, Heading4, UIBig } from "../../components/Typography"
import { MainButton, MainButtonText } from "../../components/Buttons"
import SvanurinnLogoSVG from "../../components/Svg/Logos/Svanurinn"
import VocLogoSVG from "../../components/Svg/Logos/Voc"
import { mediaMax } from "../../constants/breakpoints"
import superjson from 'superjson'
import { useRouter } from "next/router"
import certMapper from '../../mappers/certificates'
import { User } from "../../types/auth"
import jwt_decode from 'jwt-decode';
import { Project } from "../../types/projects"
import { Select } from "antd"
import { getCertImage } from "../../utils/getCertImage"
import axios from 'axios'
import { useState } from "react"

const CertsWithIcons = [
  'EPD',
  'FSC',
  'VOC',
  'SV',
  'EV',
  'SV_ALLOWED',
  'BLENGILL'
]

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id !== undefined ? context.query.id.toString() : ''
  const company = parseInt(context.query.c.toString())

  const currentUser = context.req.cookies?.vistbokUser ? context.req.cookies?.vistbokUser : null

  let user : User = null
  if(currentUser){
    user = jwt_decode(currentUser)
  }

  const prismaUser = await prismaInstance.vistbokUser.findUnique({
    where: {
      id: parseInt(user.id as string)
    },
    include: {
      projects: {
        include: {
          owner: true
        }
      }
    }
  })

  const userProjects = prismaUser.projects as Array<Project>

  
  const uniqueProduct = await prismaInstance.product.findUnique({
    where: {
      productIdentifier : { productid: id, companyid: company}
    },
    include: {
      sellingcompany: true,
      categories : true,
      subCategories: true,
      certificateSystems: true,
      certificates: {
        include: {
          certificate : true
        }
      }
    },
  });

  const productsInUserProjects = await prismaInstance.productsInProjects.findMany({
    where: {
      productId: uniqueProduct.productid,
      project: {
        owner: {
          id: parseInt(user.id as string)
        }
      }
    }
  })

  console.log('productsInUserProjects', productsInUserProjects)

  const uniqueProductString = superjson.stringify(uniqueProduct)

  return {
    props: {
      userProjects,
      productString: uniqueProductString,
      // productsInUserProjects
    },
  }
}

interface ProductPageProps{
  productString: string
  userProjects?: Array<Project>
  productsInUserProjects?: any

}

const Product = ({ productString, userProjects, productsInUserProjects } : ProductPageProps) => {
  console.log('productsInUserProjects', productsInUserProjects)
  //TODO FIX PRODUCT TYPES
  const product: ProductProps = superjson.parse(productString)
  const [chosenProject, setChosenProject] = useState<number>(userProjects && userProjects.length > 0 ? parseInt(userProjects[0].id as string) : null)

  //Temp way to show and hide swiper so that it's ready when a company has more than 1 picture per product
  const showSwiper = false
  SwiperCore.use([Pagination])

  const handleChangeChosenProject = (e) => {
    console.log('e', e)
    setChosenProject(e.value)
  }

  const addProductToProject = () => {
    console.log('hello')
    axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/addproducttoproject`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        projectId: chosenProject,
        productId: product.id
      }
    }).then((response) => {
      console.log('response', response)
    }).catch((error) => {
      console.error('error', error)
    })
  }
  
  console.log('userProjects', userProjects)

  return(
    <Page>
      <StyledHeader showSearch={true}/>
      <PageContainer>
        <ProductInfo>
          <ProductInfoLeft>
            {showSwiper ? (
               <Swiper
                spaceBetween={50}
                slidesPerView={1}
                pagination
              >
              <SwiperSlide>
                <ImageWrapper>
                  <StyledImage
                    src={product.productimageurl} 
                    alt={`product image - ${product.title}`} 
                  />
                </ImageWrapper>
              </SwiperSlide>
              <SwiperSlide>
                <ImageWrapper>
                  <StyledImage
                    src={product.productimageurl} 
                    alt={`product image - ${product.title}`} 
                  />
                </ImageWrapper>
              </SwiperSlide>
              <SwiperSlide>
                <ImageWrapper>
                  <StyledImage
                    src={product.productimageurl} 
                    alt={`product image - ${product.title}`} 
                  />
                </ImageWrapper>
              </SwiperSlide>
              </Swiper>
            ) : (
              <ImageWrapper>
                {product.productimageurl && <StyledImage
                  src={product.productimageurl} 
                  alt={`product image - ${product.title}`} 
                />}
              </ImageWrapper>
            )}
          </ProductInfoLeft>
          <ProductInfoRight style={{ marginRight: 160 }}>
            <TagAndProjects>
              {product.brand && <Tag title={product.brand} style={{marginBottom: 8}} clickable={false}/>}
              <AddToProjectWrapper>
                  <Select
                    defaultValue={chosenProject}
                    style={{  }}
                    onChange={handleChangeChosenProject}
                    options={
                      userProjects.map(project => {
                        return {
                          value: project.id, label: project.title
                        }
                      })
                    } 
                  />
                  <AddToProjectButton
                    onClick={() => addProductToProject()}
                    text="Bæta við verkefni"
                  />
              </AddToProjectWrapper>
            </TagAndProjects>
            <Heading1 style={{marginTop: 23, marginBottom: 70 }}>{product.title}</Heading1> 
              <div style={{display:'flex'}}>
                <div style={{flex:1}}>
                  <UIBig style={{marginBottom: 15}}>Flokkar</UIBig>
                  <ProductCategories>
                    {product.categories.map((category : Category, index : number) => {
                      return (
                        <Tag key={index} title={category.name} style={{marginBottom: 8}} clickable={false}  /> //onClick={() => reRouteToSearchPage('bull', 1)}
                      )
                    })}
                    {product.subCategories.map((category : Category, index : number) => {
                      return (
                        <Tag key={index} title={category.name} style={{marginBottom: 8}} clickable={false} />
                      )
                    })}
                  </ProductCategories>
                </div>
                {/* IF CERTIFICATE IS EPD, VOC, FSC OR ENERGY, THEN SHOW FILES */}
                {product.certificates.filter(x => ((x.certificateid === 1 || x.certificateid === 2 || x.certificateid === 3 ) && x.validDate !== null) || x.certificateid === 10).length > 0 && 
                  <div style={{flex:1}}>
                    <UIBig style={{marginBottom: 15}}>Fylgiskjöl</UIBig>
                    <ProductCategories>
                    {product.certificates.map((cert : ProductCertificate, index : number) => {
                      if((cert.fileurl !== '' && cert.validDate !== null) || (cert.certificate.id === 10 && cert.fileurl !== '')){
                        return (
                          <FileLinks key={index} style={{marginBottom: 8, cursor:'pointer', }} target="_blank" href={cert.fileurl}>{certMapper[cert.certificate.name]}</FileLinks>
                        )
                      }
                    })}
                    </ProductCategories>
                  </div>
                  
                }
              </div>
              <Heading4 style={{marginTop: 65, marginBottom: 50}}>{product.description && product.description.replace(/<[^>]+>/g, '')}</Heading4>
              {product.url && <>
                <UIBig style={{ marginBottom: 15 }}>Sjá vöru á vef</UIBig>
                <MainButton
                  text={product.sellingcompany.websiteurl.replace('https://','').replace('www.', '').replace('/','')}
                  isLink
                  href={product.url}
                />
              </>}
          </ProductInfoRight>
        </ProductInfo>

        {/* TODO: Endurhugsa þetta */}
        {product.certificates && product.certificates.length > 0 && product.certificates.filter(x => CertsWithIcons.includes(x.certificate.name)).length > 0 && <ProductCertifications>
           <Heading3 style={{marginBottom: 43}}>Vottanir</Heading3>
          <CertificateList>
            {product.certificates.map((certificate : ProductCertificate, index : number) => {
              if((certificate.certificate.name === "EPD" || certificate.certificate.name === "VOC"  || certificate.certificate.name === "FSC") && certificate.validDate < new Date() ) {
                return
              }
              else if(CertsWithIcons.includes(certificate.certificate.name)){
                return (
                  <SingleCertificateItem key={index}>
                    {getCertImage(certificate.certificate.name)}
                  </SingleCertificateItem>
                )
              }
            })}
          </CertificateList>  
        </ProductCertifications>}
      </PageContainer>
      <Footer />
    </Page>
  )
}

export default Product

const AddToProjectButton = styled(MainButton)`
 
`

const StyledImage = styled.img`
  object-fit: contain;
  height:100%;
  width:100%;
`

const AddToProjectWrapper = styled.div`
  display:flex;
  justify-content: flex-end;
  width: 100%;

  .ant-select{
    width: 140px;
    margin-right:10px;
    .ant-select-selector{
      border-radius: 1284.43px;
      padding: 0 15px;
    }
  }
`

const TagAndProjects = styled.div`
  display:flex;
  flex-direction:row;
  justify-content: space-between;
`

const FileLinks = styled.a`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 12px;
  line-height: 104%;
  letter-spacing: 0.09em;
`



const SingleCertificateItem = styled.div`
  display:flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;
  margin: 0 10px;

  @media ${mediaMax.tablet}{
    margin-bottom:60px;
  }
`

const ProductCertifications = styled.div`
  width:100%;
  background-color: ${({ theme }) => theme.colors.beige};
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  padding: 35px 0 45px 0;
  margin-top:150px;
`

const CertificateList = styled.div`
  display:flex;
  flex-direction:row;

  @media ${mediaMax.tablet}{
    flex-direction:column;
  }
`

const ProductCategories = styled.div`
  display:flex;
  flex-direction:column;
`

const PageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding-bottom:200px;
  padding-top:40px;
`

const StyledHeader = styled(Header)`
  margin-bottom:225px;
`

const Page = styled.div`
  min-height:100vh;
  background-color: ${({ theme }) => theme.colors.grey_one};
  padding-top:92px;
`

const ProductInfo = styled.div`
  width: 100%;
  display:flex;
  flex-direction:row;
  
  @media ${mediaMax.tablet}{
    flex-direction:column;
    padding: 0 20px;
  }
`

const ProductInfoLeft = styled.div`
  width:50%;

  @media ${mediaMax.tablet}{
    width: 100%;
    margin-bottom: 40px;
  }
`

const ProductInfoRight = styled.div`
  width:50%;

  @media ${mediaMax.tablet}{
    width: 100%;
  }
`

const ProductText = styled.p`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
`


const ImageWrapper = styled.div`
  height: 430px;
  width:80%;
  margin: 0 auto;
  position:relative;
`