import { GetServerSideProps, GetStaticProps } from 'next'
import React from 'react'
import styled from 'styled-components'
import { Banner } from '../components/Banner'
import { FrontpageCatBox } from '../components/FrontpageCatBox'
import { Header } from '../components/Header'
import { mediaMax } from '../constants/breakpoints'
import { Certificate } from '../types/certificates'
import { Category, Company, ProductProps } from '../types/products'
import { prismaInstance } from '../lib/prisma'
import { SearchPage } from '../components/SearchPage'
import { Footer } from '../components/Footer'
import superjson from 'superjson'
import { H1 } from '../components/Typography'
import { MainButton } from '../components/Buttons'
import axios from 'axios'

export const getServerSideProps: GetServerSideProps = async () => {

  const authenticated = true
  return { props :{ authenticated } }
}


type LoginProps = {
  authenticated: boolean
}

const Home = ({ authenticated } : LoginProps) => {
  
  const tryLogin = () => {
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
  
  return(
   <div>
    <p>HELLO LOGIN SCREEN</p>
    <MainButton text="login" onClick={() => { tryLogin() }}/>
   </div>
  )
}

export default Home

const SmallerBox = styled.div`
  background-color: ${({ color }) => color};
  width:50%;
  min-height: 200px;
  display:flex;
  flex-direction:row;
  justify-content: center;
  align-items: center;
  padding: 40px 0;

  >*{
    max-width: 60%;
  }

  @media ${mediaMax.tablet}{
    width:100%;
    height: auto;
    min-height:auto;
    padding: 95px 0 45px 0;
  }
`

const FakeH1 = styled.h3`
  ${H1}
`

interface BoxProps{
  color: string
}

const Box = styled.div<BoxProps>`
  background-color: ${({ color }) => color};
  width:50%;
  min-height: 200px;
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;

  >*{
    max-width: 60%;
  }

  @media ${mediaMax.tablet}{
    width:100%;
    min-height: 355px;
  }
`

const SplitBoxes = styled.div`
  width:100%;
  display:flex;
  flex-direction:row;
  margin-bottom:100px;

  @media ${mediaMax.tablet}{
    flex-direction:column;
  }
`

const PageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding-bottom:200px;
`

const Page = styled.div`
  min-height:100vh;
  background-color: ${({ theme }) => theme.colors.grey_one};
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