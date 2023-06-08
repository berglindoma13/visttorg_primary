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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id !== undefined ? context.query.id.toString() : ''
  const company = parseInt(context.query.c.toString())

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
  const uniqueProductString = superjson.stringify(uniqueProduct)

  return {
    props: {
      id,
      productString: uniqueProductString
    },
  }
}

interface ProductPageProps{
  productString: string
}

const Product = ({ productString } : ProductPageProps) => {

  
  // const router = useRouter()
  
  // const reRouteToSearchPage = (category: string, filterLevel: number) => {

  //   //add the category to sessionStorage and reset all other sessionStorage items
  //   if(filterLevel === 1){
      
  //     const newFilters = []
  //     newFilters.push(category)
      
  //     sessionStorage.setItem('level1Filters', JSON.stringify(newFilters))
  //     sessionStorage.setItem('level2Filters', JSON.stringify([]))
  //     sessionStorage.setItem('queryParam', '')
      
  //   }else {
      
  //     const newFilters = []
  //     newFilters.push(category)
      
  //     sessionStorage.setItem('level2Filters', JSON.stringify(newFilters))
  //     sessionStorage.setItem('level1Filters', JSON.stringify([]))
  //     sessionStorage.setItem('queryParam', '')
  //   }
    
    
  //   //Push to frontpage
  //   router.push('/')
    
  // }
  

  //TODO FIX PRODUCT TYPES
  const product: ProductProps = superjson.parse(productString)

  //Temp way to show and hide swiper so that it's ready when a company has more than 1 picture per product
  const showSwiper = false
  SwiperCore.use([Pagination])


  const getCertImage = (cert: string) => {
    switch(cert){
      case 'EPD':
        return <CertImageWrapper><Image src='/epdLogo.png' layout="fill" objectFit="contain" /></CertImageWrapper>
      case 'FSC':
        return <CertImageWrapper><Image src='/FSC_LOGO.jpg' layout="fill" objectFit="contain" /></CertImageWrapper>
      case 'BREEAM':
        return <CertImageWrapper><Image src='/BREEAM_LOGO.png' layout="fill" objectFit="contain" /></CertImageWrapper>
      case 'SV':
        return <CertImageWrapper><SvanurinnLogoSVG /></CertImageWrapper>
      case 'VOC':
        return <CertImageWrapper><VocLogoSVG /></CertImageWrapper>
      case 'SV_ALLOWED':
        return <CertImageWrapper><Image src='/leyfilegt-svansvottad.png' layout="fill" objectFit="contain" /></CertImageWrapper>
      case 'EV':
        return <CertImageWrapper><Image src='/Euroblume_logo.svg.png' layout="fill" objectFit="contain" /></CertImageWrapper>
      // case 'CE':
      //   return <CertImageWrapper><Image src='/ce_logo.png' layout="fill" objectFit="contain" /></CertImageWrapper>
      case 'BLENGILL':
        return <CertImageWrapper><Image src='/blue_angel_logo.png' layout="fill" objectFit="contain" /></CertImageWrapper>
    }
  }

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
            <Tag title={product.brand} style={{marginBottom: 8}} clickable={false}/>
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
        <ProductCertifications>
           <Heading3 style={{marginBottom: 43}}>Vottanir</Heading3>
          <CertificateList>
            {product.certificates.map((certificate : ProductCertificate, index : number) => {
              if((certificate.certificate.name === "EPD" || certificate.certificate.name === "VOC"  || certificate.certificate.name === "FSC") && certificate.validDate < new Date() ) {
                return
              }
              else {
              return (
                <SingleCertificateItem key={index}>
                  {getCertImage(certificate.certificate.name)}
                </SingleCertificateItem>
              )
            }
            })}
          </CertificateList>  
        </ProductCertifications>
      </PageContainer>
      <Footer />
    </Page>
  )
}

export default Product

const StyledImage = styled.img`
  object-fit: contain;
  height:100%;
  width:100%;
`

const FileLinks = styled.a`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 12px;
  line-height: 104%;
  letter-spacing: 0.09em;
`

const CertImageWrapper = styled.div`
  position: relative;
  height: 80px;
  width: 100px;
  display:flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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