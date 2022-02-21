import { GetStaticProps } from 'next'
import React from 'react'
import styled from 'styled-components'
import { Banner } from '../components/Banner'
import { FrontpageCatBox } from '../components/FrontpageCatBox'
import { Header } from '../components/Header'
import { mediaMax } from '../constants/breakpoints'
import { Certificate } from '../types/certificates'
import { Category, Company, ProductProps } from '../types/products'
import { prismaInstance } from '../lib/prisma'
import BykoCertificateMapper from '../server/mappers/certificates/byko'
import { SearchPage } from '../components/SearchPage'
import { Footer } from '../components/Footer'

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

  return { props: { productList, categories, certificates, companies }}
}

interface Counter {
  name: string
  count: number
}

type HomeProps = {
  productList: ProductProps[]
  categories: Category[]
  certificates : Certificate[]
  companies: Company[]
  categoryCounts: Array<Counter>
  certificateCounts: Array<Counter>
  companyCounts: Array<Counter>
}
interface CheckboxProps {
  keyer : string
  value : string
}

const Home = ({ productList = [], categories, certificates = [], companies = [], categoryCounts, certificateCounts, companyCounts } : HomeProps) => {
  
  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false}/>
        <StyledBanner />
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