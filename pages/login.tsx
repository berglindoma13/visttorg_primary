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
import { useRouter } from 'next/router';
import { validateEmail } from '../utils/emailValidation';
import { Spin } from 'antd';
import { readCookie } from '../utils/readCookie';

const COOKIE_NAME = 'vistbokUser'

interface User {
  fullName?: string
  email: string
  company?: string
  jobTitle?: string
  password: string
}

const Login = () => {

  const { handleSubmit, watch, control, formState: { errors } } = useForm<User>({ defaultValues: {fullName: "", email: "", company: "", jobTitle:"", password:""}});

  const router = useRouter()

  const [loginError, setLoginError] = useState(false)
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  
  const onSubmitLogin: SubmitHandler<User> = (data) => {
    setIsLoading(true);
    axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: data.email,
        password: data.password
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.data;
      }

      throw new Error(response.statusText);
    })
    .then((responsejson) => {
      console.log('success', responsejson)
      document.cookie = `${COOKIE_NAME}=${JSON.stringify(responsejson)}`
      setIsLoading(false);
      router.push('/minarsidur')
    })
    .catch((err: Error | AxiosError) => {
      if (axios.isAxiosError(err))  {
        console.error('isAxios error', err)
        setLoginError(true);
        setMessage("Villa við innskráningu, reyndu aftur seinna");
        setIsLoading(false);
        if(err?.response?.data == "user not found") {
          setLoginError(true);
          setMessage("Þessi notandi er ekki til");
        }
        // Wrong password, setting error message
        else if (err?.response?.data == "password does not match user") {
          setLoginError(true);
          setMessage("Rangt lykilorð");
        } 
      } else {
        console.error('is regular error', err)
        // Just a stock error
        setLoginError(true);
        setMessage("Villa við innskráningu, reyndu aftur seinna");
      }
    })
  };

  const onSubmitRegister: SubmitHandler<User> = (data) => {
    setIsLoading(true);
    axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/register`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: data.email,
        password: data.password,
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
      console.log('success', responsejson);
      setIsLoading(false);
      document.cookie = `${COOKIE_NAME}=${JSON.stringify(responsejson)}`
      router.push('/minarsidur')
    })
    .catch((err: Error | AxiosError) => {
      if (axios.isAxiosError(err))  {
        setIsLoading(false);
        setLoginError(true);
        setMessage("Villa við innskráningu, reyndu aftur seinna");
        console.error('isAxios error', err)
        if(!!err.response && err.response.data == "user already exists") {
          setLoginError(true);
          setMessage("Þetta netfang er í notkun");
        }
      } else {
        console.error('is regular error', err)
        setLoginError(true);
        setMessage("Villa við innskráningu, reyndu aftur seinna");
        // Just a stock error
      }
    })
  };

  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    const token = readCookie(COOKIE_NAME);
    if(!!token){
      router.push('/minarsidur')
    }
  }, [])

  useEffect(() => {
    console.log('errors', errors)
  }, [errors])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => setLoginError(false));
    return () => subscription.unsubscribe();
  }, [watch])

  return(
    <Page>
      <StyledHeader showSearch={false} />
      <PageContainer>
        {isNewUser ? 
          <LoginContainer>
            <MainHeading>Nýskráning</MainHeading>
            <form style={{all:'inherit'}} onSubmit={handleSubmit(onSubmitRegister)}>
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => <StyledInput placeholder={'Fullt Nafn'} {...field}></StyledInput> }
                rules={{required:true}}
              />
              {errors.fullName?.type === 'required' && <ErrorMessage role="alert">Vinsamlegast fylltu inn fullt nafn</ErrorMessage>}
               <Controller
                control={control}
                name="jobTitle"
                render={({ field }) => <StyledInput placeholder={'Starfsheiti'} {...field}></StyledInput> }
                rules={{required:true}}
              />
              {errors.jobTitle?.type === 'required' && <ErrorMessage role="alert">Vinsamlegast fylltu inn starfsheiti</ErrorMessage>}
               <Controller
                control={control}
                name="company"
                render={({ field }) => <StyledInput placeholder={'Fyrirtæki'} {...field}></StyledInput> }
                rules={{required:true}}
              />
              {errors.company?.type === 'required' && <ErrorMessage role="alert">Vinsamlegast fylltu inn fyrirtæki</ErrorMessage>}
               <Controller
                control={control}
                name="email"
                render={({ field }) => <StyledInput placeholder={'Netfang'} {...field}></StyledInput> }
                rules={{required:true}}
              />
              {errors.email?.type === 'required' && <ErrorMessage role="alert">Vinsamlegast fylltu inn netfang</ErrorMessage>}
               <Controller
                control={control}
                name="password"
                render={({ field }) => <StyledInput type="password" placeholder={'Lykilorð'} {...field}></StyledInput> }
                rules={{required:true}}
              />
              {errors.password?.type === 'required' && <ErrorMessage role="alert">Vinsamlegast fylltu inn lykilorð</ErrorMessage>}
              {loginError && <ErrorMessage>{message}</ErrorMessage>}
              {isLoading ? <SubmitButton disabled={true} > <Spin size="small" /> </SubmitButton> : 
              <SubmitButton onClick={() => handleSubmit(onSubmitRegister)}>Skrá</SubmitButton>}
            </form>
            <TextWithLine>
              <Sideline/>
                <span style={{marginLeft:5, marginRight:5, color:"DimGrey"}} >Áttu nú þegar aðgang?</span>
              <Sideline/>
              </TextWithLine>
            <SubmitButton onClick={() => setIsNewUser(!isNewUser)}>Innskráning</SubmitButton>
          </LoginContainer>
        :
          <LoginContainer>
            <MainHeading>Innskráning</MainHeading> 
            <form style={{all:'inherit'}}  onSubmit={handleSubmit(onSubmitLogin)}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => <StyledInput placeholder={'Netfang'} {...field} ></StyledInput> }
                rules={{required:true, validate: validateEmail}}
              />
              {errors.email?.type === 'required' && <ErrorMessage role="alert">Vinsamlegast fylltu inn netfang</ErrorMessage>}
              {errors.email?.type === 'validate' && <ErrorMessage role="alert">Ekki gilt netfang</ErrorMessage>}
               <Controller
                control={control}
                name="password"
                render={({ field }) => <StyledInput type="password" placeholder={'Lykilorð'} {...field}></StyledInput> }
                rules={{required:true}}
              />
              {errors.password?.type === 'required' && <ErrorMessage role="alert">Vinsamlegast fylltu inn lykilorð</ErrorMessage>}
              {loginError && <ErrorMessage>{message}</ErrorMessage>}
              {isLoading ? <SubmitButton disabled={true} > <Spin size="small" /> </SubmitButton> : 
              <SubmitButton onClick={() => handleSubmit(onSubmitLogin)}>Skrá</SubmitButton>}
            </form>
            <TextWithLine>
              <Sideline/>
                <span style={{marginLeft:5, marginRight:5, color:"DimGrey"}} >Viltu búa til nýjan aðgang?</span>
              <Sideline/>
            </TextWithLine>
            <SubmitButton onClick={() => setIsNewUser(!isNewUser)}>Nýskráning</SubmitButton>
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
  margin-top:20px;

  @media ${mediaMax.tablet}{
    width: 80%;
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
  width:90px;
  margin:6px;
  margin-top:20px;

  .ant-spin-dot-item {
    background-color: black;
  }
`

const Sideline = styled.div`
  height:1px;
  width: 8vw;
  background-color:DarkGray;
`

const TextWithLine = styled.div`
  display:flex;
  align-items:center;
  margin-top:14px;
`

const ErrorMessage = styled.div`
  margin-top:5px;
  color:red;
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