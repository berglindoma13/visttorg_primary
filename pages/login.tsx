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
import { useForm, SubmitHandler, Controller } from "react-hook-form";

const salt = bcrypt.genSaltSync(10)

interface User {
  fullName?: string
  email: string
  company?: string
  jobTitle?: string
  password: string
}

const Login = () => {

  const { handleSubmit, control, formState: { errors } } = useForm<User>({ defaultValues: {fullName: "", email: "", company: "", jobTitle:"", password:""}});
  
  const onSubmitLogin: SubmitHandler<User> = data => {
    const hashedPassword = bcrypt.hashSync(data.password, salt)
    axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: data.email,
        password: hashedPassword
      }
    }).then((response) => {
      
      if (response.status === 200) {
        return response.data;
      }

      throw new Error(response.statusText);
    })
    .then((responsejson) => {
      console.log('success', responsejson)
      sessionStorage.setItem('jwttoken', responsejson)
    })
    .catch((err: Error | AxiosError) => {
      if (axios.isAxiosError(err))  {
        console.error('isAxios error', err.response.data)
        // Access to config, request, and response
      } else {
        console.error('is regular error', err)
        // Just a stock error
      }
    })
  };

  const onSubmitRegister: SubmitHandler<User> = data => {
    const hashedPassword = bcrypt.hashSync(data.password, salt)
    axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/register`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: data.email,
        password: hashedPassword,
        fullname: data.fullName,
        company: data.company,
        jobtitle: data.jobTitle
      }
    }).then((response) => {

      if (response.status === 200) {
        return response.data;
      }

      throw new Error(response.statusText);
    })
    .then((responsejson) => {
      console.log('success', responsejson)
      sessionStorage.setItem('jwttoken', responsejson)
    })
    .catch((err: Error | AxiosError) => {
      if (axios.isAxiosError(err))  {
        console.error('isAxios error', err.response.data)
        // Access to config, request, and response
      } else {
        console.error('is regular error', err)
        // Just a stock error
      }
    })
    // .catch((error) => {
    //   console.log('this is the error', error)
    // //   console.error('error registering - Message:', error.message)
    //   //TODO get the .send() to work in Postlist api in express to get the correct error message through the server
    //   // setInputError(error.message)
     
    // });
  };


  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('jwttoken');
    if(!!token){
      const decoded = jwt_decode(token);
      console.log(decoded);
    }
  }, [])
  
  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false} />
        {isNewUser ? 
          <LoginContainer>
            <MainHeading>Nýskráning</MainHeading>
            <form onSubmit={handleSubmit(onSubmitRegister)}>
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => <StyledInput placeholder={'Fullt Nafn'} {...field}></StyledInput> }
              />
               <Controller
                control={control}
                name="jobTitle"
                render={({ field }) => <StyledInput placeholder={'Starfsheiti'} {...field}></StyledInput> }
              />
               <Controller
                control={control}
                name="company"
                render={({ field }) => <StyledInput placeholder={'Fyrirtæki'} {...field}></StyledInput> }
              />
               <Controller
                control={control}
                name="email"
                render={({ field }) => <StyledInput placeholder={'Netfang'} {...field}></StyledInput> }
              />
               <Controller
                control={control}
                name="password"
                render={({ field }) => <StyledInput placeholder={'Lykilorð'} {...field}></StyledInput> }
              />
              <SubmitButton onClick={() => handleSubmit(onSubmitRegister)}>Skrá</SubmitButton>
            </form>
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
            <form onSubmit={handleSubmit(onSubmitLogin)}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => <StyledInput placeholder={'Netfang'} {...field}></StyledInput> }
              />
               <Controller
                control={control}
                name="password"
                render={({ field }) => <StyledInput placeholder={'Lykilorð'} {...field}></StyledInput> }
              />
              <SubmitButton onClick={() => handleSubmit(onSubmitLogin)}>Skrá</SubmitButton>
            </form>
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