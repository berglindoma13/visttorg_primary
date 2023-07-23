import { GetServerSideProps, GetStaticProps, GetServerSidePropsContext } from 'next';
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
import jwt_decode from 'jwt-decode';
import { MyPagesSidebar } from '../components/Drawer/MyPagesSidebar'
import { Layout } from 'antd';


interface User {
  fullname?: string
  email: string
  company?: string
  jobtitle?: string
  password: string
}

interface MyFavoritesProps {
  user: User
  productListString: string
}


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const currentUser = context.req.cookies?.vistbokUser ? context.req.cookies?.vistbokUser : null

  let user : User = null
  let email: string = null
  if(currentUser){
    user = jwt_decode(currentUser)
    email = user.email
  } 

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

  return { props: { 
    user: user,
    productListString: productListString
  }}
}

const MyFavorites = ({ user, productListString }: MyFavoritesProps) => {
  
  const productList: Array<ProductProps> = superjson.parse(productListString)

  // const myProducts = useAppSelector((state) => state.favorites.products)
  const [favorites, setFavorites] = useState([])

  // useEffect(() => {
  //   getCurrentFavorites()
  // }, [])

  useEffect(() => {
    console.log('user', user)
    if(!user){
      //TODO: Fix this - if user not logged in
      // router.push('/login')
    }
  }, [])

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
      <Layout>
        <MyPagesSidebar/>
          <Layout>
            {/* <StyledHeader showSearch={false} /> */}
            { user && (<UserCardContainer> 
                <MainHeading> Þínar uppáhalds vörur </MainHeading>
            </UserCardContainer>)}
            <PageContainer>
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
          </Layout>
      </Layout>
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

const MainHeading = styled(Heading1)`
  // max-width:930px;
  // width:100%;
  // text-align:center;
  // margin: 0 auto;
  // padding-bottom:80px;
  font-size: 48px;
  width:100%;
  padding-bottom:15px;
`

const UserCardContainer = styled.div`
  height:30vw;
  width:100vw;
  display: flex;
  flex-direction: column;
  align-items:flex-start;
  padding-left:40px;
  padding-top:40px;
  background-image:url('/wave_v5.svg');
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 30vh;

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

