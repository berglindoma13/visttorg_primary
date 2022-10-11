import { GetServerSideProps } from 'next'
import React from 'react'
import styled from 'styled-components'
import { Banner } from '../components/Banner'
import { FrontpageCatBox } from '../components/FrontpageCatBox'
import { Header } from '../components/Header'
import { mediaMax } from '../constants/breakpoints'
import { Certificate, ProductCertificate } from '../types/certificates'
import { Category, Company, ProductProps } from '../types/products'
import { prismaInstance } from '../lib/prisma'
import { SearchPage } from '../components/SearchPage'
import { Footer } from '../components/Footer'
import superjson from 'superjson'
import { H1 } from '../components/Typography'

// import sanityClient from '@sanity/client'

// const client = sanityClient({
//   projectId: 'dmvpih9k',
//   dataset: 'production',
//   useCdn: true, // `false` if you want to ensure fresh data
// })

export const getServerSideProps: GetServerSideProps = async () => {

  const filterValidDate = (val) => {
    if(val.certificateid === 1 || val.certificateid === 2 || val.certificateid === 3) {
      return !!val.validDate && val.validDate > new Date()
    }
    else {
      return true
    }
  }

  // ALL PRODUCTS
  const productList = await prismaInstance.product.findMany({
    include: {
      sellingcompany: true,
      categories : true,
      subCategories : true,
      certificates: {
        include: {
          certificate : true
        }
      }
    },
  });

  // remove certificates that are not valid 
  const filteredProductList = productList.map(prod => {
    const filteredCertificates = prod.certificates.filter(filterValidDate)
    prod.certificates = filteredCertificates;
    return prod
  })

  //remove products that have no certificates after filter above
  const doubleFilterProductList = filteredProductList.filter(prod => prod.certificates.length > 0)

  // ALL CATEGORIES
  const categories = await prismaInstance.category.findMany()

  // ALL COMPANIES
  const companiesA = await prismaInstance.company.findMany()
  const companies = await prismaInstance.company.findMany({
    include: {
      products: true
    }
  })

  // COMPANY COUNTS
  const companyCounts = []
  companies.map(comp => {
    let count = 0
    doubleFilterProductList.map(prod => {
      if(prod.companyid === comp.id){
        count++
      }
    })
    companyCounts.push({ name: comp.name, count: count})
  })

  // ALL CERTIFICATES
  const certificatesA = await prismaInstance.certificate.findMany()
  const certificates = await prismaInstance.certificate.findMany({
    include: {
      productcertificate: true
    }
  })
  
  // CERTIFICATE COUNTS
  const certificateCounts = []
  certificates.map(cert => {
    if(cert.name === 'EPD' || cert.name === 'FSC' || cert.name === 'VOC') {
      const validCertificates = cert.productcertificate.filter(filterValidDate)
      certificateCounts.push({ name: cert.name, count: validCertificates.length})
    }
    else {
      certificateCounts.push({ name: cert.name, count: cert.productcertificate.length})
    }
  })

  const productListString = superjson.stringify(doubleFilterProductList)

  return { props: { productListString, categories, certificatesA, companiesA, certificateCounts, companyCounts }}
}

interface Counter {
  name: string
  count: number
}

type HomeProps = {
  productListString: string
  categories: Category[]
  certificatesA : Certificate[]
  companiesA: Company[]
  categoryCounts: Array<Counter>
  certificateCounts: Array<Counter>
  companyCounts: Array<Counter>
}

const Home = ({ productListString, categories, certificatesA = [], companiesA = [], certificateCounts, companyCounts } : HomeProps) => {

  // client.getDocument('3000b472-0bb2-48e0-aad0-8d9d832e16fa').then((cert) => {
  //   console.log(`${cert.productid}`)
  // })

  const productList: Array<ProductProps> = superjson.parse(productListString)
  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false}/>
        <StyledBanner />
        {/* <SplitBoxes>
          <SmallerBox color={theme.colors.green}>
            <FakeH1>
              Verkefnið er styrkt af
            </FakeH1>
          </SmallerBox>
          <Box color={theme.colors.beige}>
            <Heading3>
              Hönnunarsjóð
            </Heading3>
            <Heading3>
              Ask Mannvirkjarannsóknarsjóð
            </Heading3>
          </Box>
        </SplitBoxes> */}
        <CategoryBoxes>
          <FrontpageCatBox color='orange' iconImage='Sink' title='Baðherbergi' url='/?cat=Baðherbergi#search'/>
          <FrontpageCatBox color='green' iconImage='PaperPen' title='Gólfefni' url='/?cat=Gólfefni#search'/>
          <FrontpageCatBox color='purple' iconImage='PaintBucket' title='Málning' url='/?cat=Málningarvörur#search'/>
        </CategoryBoxes>
        <SearchPage 
          products={productList} 
          certificates={certificatesA} 
          companies={companiesA}
          companyCounts={companyCounts}
          certificateCounts={certificateCounts}
        />
      </PageContainer>
      <Footer />
    </Page>
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