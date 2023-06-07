import { GetServerSideProps, GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react'
import { prismaInstance } from '../lib/prisma'
import { ProductProps } from '../types/products';
import styled from 'styled-components'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { addToFavorites, getFavorites } from '../app/features/favorites/favoriteSlice'
import superjson from 'superjson'
import { Header } from '../components/Header'
import { Product } from '../components/Product'
import { mediaMax } from '../constants/breakpoints'
import { Heading1, Heading5 } from '../components/Typography';


export const getServerSideProps: GetServerSideProps = async (req) => {

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

  const productListString = superjson.stringify(productList)

  return { props: { productListString }}
}

interface MyFavoritesProps {
  productListString: string
}

const MyFavorites = ({ productListString }: MyFavoritesProps) => {
  const productList: Array<ProductProps> = superjson.parse(productListString)

  // const myProducts = useAppSelector((state) => state.favorites.products)
  const [favorites,setFavorites] = useState([])

  // useEffect(() => {
  //   getCurrentFavorites()
  // }, [])

  // const getCurrentFavorites = () => {
  //   const currentFavorites = productList.map(prod => {
  //     if(myProducts.includes(prod.productid.toString())) {
  //       return prod
  //     }
  //   }).filter(item => {return item !== undefined })
  //   setFavorites(currentFavorites)
  // }

  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false} />
        <MainHeading>Þínar uppáhalds vörur</MainHeading>
        {favorites.length === 0 && <StyledHeading5>Þú átt engar uppáhalds vörur</StyledHeading5> }
        {/* <ProductList>
          {myProducts && (
            productList.map(prod => {
              if(myProducts.includes(prod.productid.toString())) {
                return (
                  <StyledProduct
                    key={prod.productid}
                    productId={prod.productid}
                    title={prod.title}
                    shortdescription={prod.shortdescription}
                    sellingcompany={prod.sellingcompany.name}
                    productimageurl={prod.productimageurl}
                  />
                )
              }
            })
          )}
        </ProductList> */}
        <ProductList>
          {favorites.map(prod => {
            return (
              <StyledProduct
                key={prod.productid}
                productId={prod.productid}
                title={prod.title}
                shortdescription={prod.shortdescription}
                sellingcompany={prod.sellingcompany.name}
                productimageurl={prod.productimageurl}
                productCompany={prod.sellingcompany.id}
              />
            )
          })}
        </ProductList>
      </PageContainer>
    </Page>
  )
}

export default MyFavorites

const Page = styled.div`
  background-color: ${({ theme }) => theme.colors.grey_one};
  min-height:100vh;
`

const PageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding-bottom:200px;
`

const StyledHeader = styled(Header)`
  margin-bottom:50px;
`

const MainHeading = styled(Heading1)`
  max-width:930px;
  width:100%;
  text-align:center;
  margin: 0 auto;
  padding-bottom:80px;
`

const StyledHeading5 = styled(Heading5)`
  max-width:930px;
  width:100%;
  text-align:center;
  margin: 0 auto;
  padding-bottom:80px;
`

const StyledProduct = styled(Product)`
  margin-right: 15px;
  margin-bottom:15px;

  @media ${mediaMax.tablet}{
    margin-right:0;
  }
`

const ProductList = styled.div`
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  width:100%;
  justify-content: center;
`

