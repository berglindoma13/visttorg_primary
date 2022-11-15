import { GetServerSideProps } from 'next'
import React from 'react'
import styled from 'styled-components'
import { Banner } from '../components/Banner'
import { FrontpageCatBox } from '../components/FrontpageCatBox'
import { Header } from '../components/Header'
import { mediaMax } from '../constants/breakpoints'
import { Certificate, CertificateSystem, ProductCertificate } from '../types/certificates'
import { Category, Company, ProductProps } from '../types/products'
import { prismaInstance } from '../lib/prisma'
import { SearchPage } from '../components/SearchPage'
import { Footer } from '../components/Footer'
import superjson from 'superjson'
import { H1, H3, H4, Heading3, Heading4, Heading5 } from '../components/Typography'
import { theme } from '../styles'

// import sanityClient from '@sanity/client'

// const client = sanityClient({
//   projectId: 'dmvpih9k',
//   dataset: 'production',
//   useCdn: true, // `false` if you want to ensure fresh data
// })

export const getServerSideProps: GetServerSideProps = async () => {

  
  return { props: {  }}
}


const Home = () => {
  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false}/>
       
       
        
      </PageContainer>
      <SplitBoxes>
        <SmallerBox color={theme.colors.green}>
          <FakeH1>
            Verkefnið er styrkt af
          </FakeH1>
        </SmallerBox>
        <Box color={theme.colors.orange}>
          <Heading5>
            Hönnunarsjóði og HMS
          </Heading5>
        </Box>
      </SplitBoxes>
      <Footer />
    </Page>
  )
}

export default Home

const SmallerBox = styled.div`
  background-color: ${({ color }) => color};
  width:50%;
  min-height: 80px;
  display:flex;
  flex-direction:row;
  justify-content: center;
  align-items: center;
  padding: 15px 0;

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
  ${H4}
`

interface BoxProps{
  color: string
}

const Box = styled.div<BoxProps>`
  background-color: ${({ color }) => color};
  width:50%;
  min-height: 80px;
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