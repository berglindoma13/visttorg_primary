import { GetServerSideProps } from "next"
import { prismaInstance } from '../../lib/prisma'
import { ProductProps, Company, Category } from '../../types/products'
import styled from 'styled-components'
import Image from 'next/image'
import { ProductCertificate } from "../../types/certificates"

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

  return {
    props: {
      id,
      product: uniqueProduct
    },
  }
}

interface ProductPageProps{
  product: ProductProps
}

const Product = ({ product} : ProductPageProps) => {
  return(
    <ContentWrapper>
      <ProductTitle>{product.title}</ProductTitle>
      <DetailWrapper>
        <ImageWrapper>
          <Image src={product.productimageurl} alt={`product image - ${product.title}`} height="100%" width="100%"/>
        </ImageWrapper>
        <ProductInfo>
          <ProductText>Vörumerki: {product.brand}</ProductText>
          <ProductText>Flokkar: {product.categories.map((category : Category, index : number) => {
            return (
              <span key={index}>{category.name}</span>
            )
          })}</ProductText>
          <ProductText>Vottanir: {product.certificates.map((certificate : ProductCertificate, index : number) => {
            return (
              <span key={index}>{certificate.certificate.name}, </span>
            )
          })}</ProductText>
          <ProductText>Löng lýsing: {product.description}</ProductText>
          <ProductText>Stutt lýsing: {product.shortdescription}</ProductText>
          <ProductText>Fyrirtæki: {product.sellingcompany.name}</ProductText>
          <ProductText>Slóð: <a target="_blank" href={product.url}>{product.url}</a></ProductText>
        </ProductInfo>
      </DetailWrapper>
    </ContentWrapper>
  )
}

export default Product

const ContentWrapper = styled.div`
  background-color: rgba(255,255,255, 0.5);
  padding:20px;
`

const DetailWrapper = styled.div`
  display:flex;
  flex-direction:row;
`

const ProductTitle = styled.h1`
  margin-bottom:20px;
`

const ProductText = styled.p`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
`

const ProductInfo = styled.div`

`

const ImageWrapper = styled.div`
  height: 30vw;
  width: 30vw;
  display:flex;
  flex-direction:row;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 5px 2px 1px rgba(0, 0, 255, .2);
  margin-right: 30px;
`