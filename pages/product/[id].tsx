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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id !== undefined ? context.query.id.toString() : ''

  const uniqueProduct = await prismaInstance.product.findUnique({
    where: {
      productid: id
    },
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

  // const filterValidDate = (val) => {
  //   if(val.certificateid === 1 || val.certificateid === 2 || val.certificateid === 3) {
  //     return !!val.validDate && val.validDate > new Date()
  //   }else if(val.certificateid === 6){
  //     return false
  //   }
  //   else {
  //     return true
  //   }
  // }

  // const filteredUniqueProduct = uniqueProduct.certificates.filter(cert => filterValidDate)

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
      <PageContainer>
        <StyledHeader showSearch={true}/>
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
                  <Image
                    src={product.productimageurl} 
                    alt={`product image - ${product.title}`} 
                    layout="fill"
                    objectFit="contain"
                  />
                </ImageWrapper>
              </SwiperSlide>
              <SwiperSlide>
                <ImageWrapper>
                  <Image
                    src={product.productimageurl} 
                    alt={`product image - ${product.title}`} 
                    layout="fill"
                    objectFit="contain"
                  />
                </ImageWrapper>
              </SwiperSlide>
              <SwiperSlide>
                <ImageWrapper>
                  <Image
                    src={product.productimageurl} 
                    alt={`product image - ${product.title}`} 
                    layout="fill"
                    objectFit="contain"
                  />
                </ImageWrapper>
              </SwiperSlide>
              </Swiper>
            ) : (
              <ImageWrapper>
                <Image
                  src={product.productimageurl} 
                  alt={`product image - ${product.title}`} 
                  layout="fill"
                  objectFit="contain"
                />
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
                        <Tag key={index} title={category.name} style={{marginBottom: 8}} clickable={false} />
                      )
                    })}
                  </ProductCategories>
                </div>
                {product.epdUrl || product.fscUrl && 
                  <div style={{flex:1}}>
                    <UIBig style={{marginBottom: 15}}>Fylgiskjöl</UIBig>
                  </div>
                }
              </div>
              <Heading4 style={{marginTop: 65, marginBottom: 50}}>{product.description.replace(/<[^>]+>/g, '')}</Heading4>
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
`

const StyledHeader = styled(Header)`
  margin-bottom:225px;
`

const Page = styled.div`
  min-height:100vh;
  background-color: ${({ theme }) => theme.colors.grey_one};
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