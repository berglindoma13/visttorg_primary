import { GetStaticProps } from 'next';
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
import { Heading1 } from '../components/Typography';


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

  const productListString = superjson.stringify(productList)

  return { props: { productListString }}
}

interface MyFavoritesProps {
  productListString: string
}

const MyFavorites = ({ productListString }: MyFavoritesProps) => {
  const productList: Array<ProductProps> = superjson.parse(productListString)

  const myProducts = useAppSelector((state) => state.favorites.products)
  const dispatch = useAppDispatch()

  const [loading,setLoading] = useState(true)
  useEffect(() => {
    const myFavs = window.localStorage.getItem('myFavorites')

    console.log('myFavs', myFavs)

    //Convert string to array

  }, [])

  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false} />
        <StyledHeader1>Þínar uppáhalds vörur</StyledHeader1>
        {/* <button onClick={() => dispatch(addToFavorites('123'))}></button> */}
        <ProductList>
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
        </ProductList>
      </PageContainer>
    </Page>
  )
}

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

const StyledHeader1 = styled(Heading1)`
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

export default MyFavorites