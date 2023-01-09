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
import Divider from '@material-ui/core/Divider';
// import { Divider } from 'rsuite';
import { useForm, SubmitHandler, Controller } from "react-hook-form";

export const getServerSideProps: GetServerSideProps = async () => {

  const authenticated = true
  return { props :{ authenticated } }
}


type LoginProps = {
  authenticated: boolean
}

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

const Login = ({ authenticated } : LoginProps) => {

  const { register, handleSubmit, control, formState: { errors } } = useForm<NewUser>();
  const onSubmit: SubmitHandler<NewUser> = data => console.log(data);


  const [isNewUser, setIsNewUser] = useState(false)

  const [newUser, setNewUser] = useState<NewUser>({fullName: "Fullt nafn", email: "Netfang", company: "Fyrirtæki", jobTitle:"starfsheiti", password:"Lykilorð"})
  const [user, setUser] = useState<User>()

  const [name, setName] = useState('name')

  // useEffect(()=> {
  // },[newUser])
  
  const tryLogin = (data) => {
    console.log("data", data)

    fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'mylogininfo',
        password: 'mypassword'
      })
    }).then((response) => {
      
      
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responsejson) => {
      console.log('success', responsejson)
    })
    .catch((error) => {
      console.error('error adding to postlist', error.message)
      //TODO get the .send() to work in Postlist api in express to get the correct error message through the server
      // setInputError(error.message)
     
    });
  }

  // const test = async() => {
  //   // await setNewUser({fullName: event.target.value, ...newUser})
  //   console.log('name', name)
  //   await setNewUser({fullName: name, ...newUser})
  //   console.log('new user', newUser);
  // }
  

  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false} />
        {isNewUser ? 
          <LoginContainer>
            <MainHeading>Nýskráning</MainHeading>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* <input placeholder={'Fullt Nafn'} {...register("fullName")} ></input> */}
              {/* <Controller 
                control={control}
                name="company"
                render={({field}) => <StyledInput placeholder={'Fyrirtæki'} {...field}></StyledInput>}
              />   */}
              {/* <StyledInput placeholder={'Starfsheiti'} onChange={(e) => setNewUser({jobTitle: e.target.value, ...newUser})} {...register("jobTitle")} ></StyledInput>
              <StyledInput placeholder={'Netfang'} onChange={(e) => setNewUser({email: e.target.value, ...newUser})} {...register("email")} ></StyledInput>
              <StyledInput placeholder={'Lykilorð'} onChange={(e) => setNewUser({password: e.target.value, ...newUser})} {...register("password")} ></StyledInput> */}
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => <input placeholder={'Fullt Nafn'} {...field}></input> }
              />
              <SubmitButton onClick={() => handleSubmit(onSubmit)}>Skrá</SubmitButton>
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