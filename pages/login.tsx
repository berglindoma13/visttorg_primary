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
import axios, { AxiosError } from 'axios';

const salt = bcrypt.genSaltSync(10)

interface NewUser {
  fullName: string
  email: string
  company: string
  jobTitle: string
  password: string
}

interface User {
  email: string
  password: string
}

const Login = () => {

  const [isNewUser, setIsNewUser] = useState(false)

  const [newUser, setNewUser] = useState<NewUser>()
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const token = sessionStorage.getItem('jwttoken');
    if(!!token){
      const decoded = jwt_decode(token);
      console.log(decoded);
    }
  }, [])
  
  const tryLogin = () => {
    const hashedPassword = bcrypt.hashSync(user.password, salt)
    fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
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
      console.error('error logging in', error.message)
      //TODO get the .send() to work in Postlist api in express to get the correct error message through the server
      // setInputError(error.message)
     
    });
  }

  const tryRegister = () => {
    const hashedPassword = bcrypt.hashSync(newUser.password, salt)
    axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/register`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: newUser.email,
        password: hashedPassword,
        fullname: newUser.fullName,
        company: newUser.company,
        jobtitle: newUser.jobTitle
      }
    }).then((response) => {
      
      console.log('response', response)
      
      // if (response.status === 200) {
      //   return response.data;
      // }


      // throw new Error(response.statusText);
    })
    .then((responsejson) => {
      // console.log('success', responsejson)
      // sessionStorage.setItem('jwttoken', responsejson)
    })
    .catch((err: Error | AxiosError) => {
      if (axios.isAxiosError(err))  {
        console.log('isAxios error', err.response.data)
        // Access to config, request, and response
      } else {
        console.log('is regular error', err)
        // Just a stock error
      }
    })
    // .catch((error) => {
    //   console.log('this is the error', error)
    // //   console.error('error registering - Message:', error.message)
    //   //TODO get the .send() to work in Postlist api in express to get the correct error message through the server
    //   // setInputError(error.message)
     
    // });
  }
  

  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false} />
        {isNewUser ? 
          <LoginContainer>
            <MainHeading>Nýskráning</MainHeading>
            <StyledInput placeholder={'Fullt Nafn'} onChange={(e) => setNewUser({fullName: e.target.value, ...newUser})}></StyledInput>
            <StyledInput placeholder={'Fyrirtæki'} onChange={(e) => setNewUser({company: e.target.value, ...newUser})} ></StyledInput>
            <StyledInput placeholder={'Starfsheiti'} onChange={(e) => setNewUser({jobTitle: e.target.value, ...newUser})} ></StyledInput>
            <StyledInput placeholder={'Netfang'} onChange={(e) => setNewUser({email: e.target.value, ...newUser})} ></StyledInput>
            <StyledInput placeholder={'Lykilorð'} onChange={(e) => setNewUser({password: e.target.value, ...newUser})} ></StyledInput>
            <SubmitButton onClick={tryRegister}>Skrá</SubmitButton>
            <TextWithLine>
              <Sideline/>
                <span style={{marginLeft:5, marginRight:5}} >Áttu nú þegar aðgang?</span>
              <Sideline/>
              </TextWithLine>
            <SubmitButton onClick={() => setIsNewUser(!isNewUser)}>Innskráning</SubmitButton>
          </LoginContainer>
        :
          <LoginContainer>
            <MainHeading>Innskráning</MainHeading> 
            <StyledInput placeholder={'Netfang'} onChange={(e) => setUser({email: e.target.value, ...user})} ></StyledInput>
            <StyledInput placeholder={'Lykilorð'} onChange={(e) => setUser({password: e.target.value, ...user})} ></StyledInput>
            <SubmitButton onClick={tryLogin}>Skrá</SubmitButton>
            <NewAccountContainer >
              <TextWithLine>
              <Sideline/>
                <span style={{marginLeft:5, marginRight:5}} >Viltu búa til nýjann aðgang?</span>
              <Sideline/>
              </TextWithLine>
              <SubmitButton onClick={() => setIsNewUser(!isNewUser)}>Nýskráning</SubmitButton>
            </NewAccountContainer>
          </LoginContainer>
        }
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

const NewAccountContainer = styled.div`
  display:flex;
  flex-direction:column;
  flex-wrap:wrap;
  width:100%;
  justify-content: center;
  align-items: center;
  margin-top:15px;
`

const SubmitButton = styled.button`
  border:none;
  background-color: ${({ theme }) => theme.colors.green};
  height:30px;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  width:90px;
  margin:6px;
`

const Sideline = styled.div`
  height:1px;
  width:50px;
  background-color:black;
`

const TextWithLine = styled.div`
  display:flex;
  align-items:center;
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