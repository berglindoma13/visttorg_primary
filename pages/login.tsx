import { GetServerSideProps, GetStaticProps } from 'next';
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
import { Banner } from '../components/Banner';
import jwt_decode from 'jwt-decode';
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10)

const Login = () => {

  useEffect(() => {
    const token = sessionStorage.getItem('jwttoken');
    if(!!token){
      const decoded = jwt_decode(token);
      console.log(decoded);
    }
  }, [])
  
  const tryLogin = () => {
    const hashedPassword = bcrypt.hashSync('password', salt)
    fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'mylogininfo',
        password: hashedPassword
      })
    }).then((response) => {
      
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responsejson) => {
      console.log('success', responsejson)
      sessionStorage.setItem('jwttoken', responsejson)
    })
    .catch((error) => {
      console.error('error adding to postlist', error.message)
      //TODO get the .send() to work in Postlist api in express to get the correct error message through the server
      // setInputError(error.message)
     
    });
  }
  
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
          <SubmitButton onClick={tryLogin}>Skrá</SubmitButton>
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

const StyledBanner = styled(Banner)`
  margin-bottom:155px;

  @media ${mediaMax.tablet}{
    margin-bottom:95px;
  }
`

const CategoryBoxes = styled.div`
  display:flex;
  flex-direction:row;
  justify-content: space-around;
  align-items: center;
  padding: 0 7.5%;
  margin-bottom:120px;

  @media ${mediaMax.tablet}{
    flex-direction: column;
    margin-bottom:90px;
  }
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