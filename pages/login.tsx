import { GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react'
import { prismaInstance } from '../lib/prisma'
import superjson from 'superjson'
import styled from 'styled-components'
// import { ProductProps } from '../types/products';
// import { useAppSelector, useAppDispatch } from '../app/hooks'
// import { addToFavorites, getFavorites } from '../app/features/favorites/favoriteSlice'
import { Header } from '../components/Header'
// import { Product } from '../components/Product'
import { mediaMax } from '../constants/breakpoints'
import { Heading1 } from '../components/Typography';
import { TextInput } from '../components/Inputs';


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

const Login = ({ productListString }: MyFavoritesProps) => {
//   const productList: Array<ProductProps> = superjson.parse(productListString)

//   const myProducts = useAppSelector((state) => state.favorites.products)
//   const dispatch = useAppDispatch()

//   const [loading,setLoading] = useState(true)
//   useEffect(() => {
//     const myFavs = window.localStorage.getItem('myFavorites')

//     // console.log('myFavs', myFavs)

//     //Convert string to array

//   }, [])

  const test = () => {

  }

  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false} />
        <MainHeading>Innskráning</MainHeading>
        <LoginContainer>
          <StyledInput placeholder={'Notendanafn'} onChange={test} onSubmit={test} ></StyledInput>
          <StyledInput placeholder={'Lykilorð'} onChange={test} onSubmit={test} ></StyledInput>
          {/* <StyledMainButton></StyledMainButton> */}
          <SubmitButton onClick={test}>Skrá</SubmitButton>
        </LoginContainer>
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

const MainHeading = styled(Heading1)`
  max-width:930px;
  width:100%;
  text-align:center;
  margin: 0 auto;
  padding-bottom:80px;
`

const StyledInput = styled(TextInput)`
  width: 390px;
  margin-bottom:45px;

  @media ${mediaMax.tablet}{
    width: 90%;
  }
`

const LoginContainer = styled.div`
    display:flex;
    flex-direction:column;
    flex-wrap:wrap;
    width:100%;
    justify-content: center;
    align-items: center;
`

const SubmitButton = styled.button`
  border:none;
  background-color: ${({ theme }) => theme.colors.green};
  height:30px;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  width:60px;
`

// const StyledProduct = styled(Product)`
//   margin-right: 15px;
//   margin-bottom:15px;

//   @media ${mediaMax.tablet}{
//     margin-right:0;
//   }
// `

// const ProductList = styled.div`
//   display:flex;
//   flex-direction:row;
//   flex-wrap:wrap;
//   width:100%;
//   justify-content: center;
// `

export default Login