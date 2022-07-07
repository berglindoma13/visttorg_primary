import { GetStaticProps } from 'next'
import React from 'react'
import styled from 'styled-components'
import { Banner } from '../components/Banner'
import { FrontpageCatBox } from '../components/FrontpageCatBox'
import { Header } from '../components/Header'
import { mediaMax } from '../constants/breakpoints'
import { Certificate } from '../types/certificates'
import { theme } from '../styles/theme'
import { Category, Company, ProductProps } from '../types/products'
import { prismaInstance } from '../lib/prisma'
import BykoCertificateMapper from '../server/mappers/certificates/byko'
import { SearchPage } from '../components/SearchPage'
import { Footer } from '../components/Footer'
import superjson from 'superjson'
import { Heading1, H4, Heading3, H1, Heading4 } from '../components/Typography'

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

  console.log(productList)

  const categories = await prismaInstance.category.findMany()
  const certificates = await prismaInstance.certificate.findMany()
  const companies = await prismaInstance.company.findMany()

  // const categoryCounts = []
  // categories.map(cat => {
  //   const filteredList = productList.filter(product => {
  //     const matched = product.categories.filter(prodCat => prodCat.name === cat.name)
  //     return matched.length > 0
  //   })
  //   categoryCounts.push({ name: cat.name, count: filteredList.length})
  // })

  // const certificateCounts = []
  // certificates.map(cert => {
  //   const filteredList = productList.filter(product => {
  //     const matched = product.certificates.filter(prodCat => {
  //       return prodCat.certificate.name === cert.name
  //     })
  //     return matched.length > 0
  //   })
  //   certificateCounts.push({ name: BykoCertificateMapper[cert.name], count: filteredList.length})
  // })

  // const companyCounts = []
  // companies.map(comp => {
  //   const filteredList = productList.filter(product => {
  //     return product.sellingcompany.name === comp.name
  //   })
  //   companyCounts.push({ name: comp.name, count: filteredList.length})
  // })

  const productListString = superjson.stringify(productList)

  return { props: { productListString , categories, certificates, companies }}
}

interface Counter {
  name: string
  count: number
}

type HomeProps = {
  productListString: string
  categories: Category[]
  certificates : Certificate[]
  companies: Company[]
  categoryCounts: Array<Counter>
  certificateCounts: Array<Counter>
  companyCounts: Array<Counter>
}

const Home = ({ productListString, categories, certificates = [], companies = [] } : HomeProps) => {
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
          certificates={certificates} 
          companies={companies} 
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