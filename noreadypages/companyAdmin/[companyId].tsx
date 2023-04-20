import { GetServerSideProps } from "next"
import { prismaInstance } from '../../lib/prisma'
import styled from 'styled-components'
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"
import { mediaMax } from "../../constants/breakpoints"
import superjson from 'superjson'
import { useRouter } from "next/router"
import { Company, ProductProps } from "../../types/products"
import { useState } from "react"
import { Key } from "reselect/es/types"
import { Heading1 } from "../../components/Typography"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const companyId = context.query.companyId !== undefined ? context.query.companyId.toString() : ''

  const allCompanyProducts = await prismaInstance.product.findMany({
    where: {
      companyid: parseInt(companyId)
    },
    include: {
      sellingcompany: true,
      categories : true,
      subCategories: true,
      certificates: {
        include: {
          certificate : true
        }
      }
    },
  });

  const companyInfo = await prismaInstance.company.findUnique({
    where: {
      id: parseInt(companyId)
    }
  })

  const allCompanyProductsString = superjson.stringify(allCompanyProducts)

  return {
    props: {
      companyProducts: allCompanyProductsString,
      companyInfo
    },
  }
}

interface companyAdminProps{
  companyProducts: string
  companyInfo: Company
}

interface ProductDict {
  [key: string]: ProductProps
}


const Product = ({ companyProducts, companyInfo } : companyAdminProps) => {

  const allproducts: Array<ProductProps> = superjson.parse(companyProducts)

  const allproductsDict = allproducts.map(prod => {
    return{
      [prod.productid]: prod
    }
  })

  const [productsState, setProductsState] = useState<Array<ProductDict>>(allproductsDict)

  // console.log('companyInfo', companyInfo)

  //Table needs to add, edit and delete lines and then update database -> button for resetting product from database

  // console.log('all produts dict', allproductsDict)

  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={true}/>
        <Heading1>Vörulisti {companyInfo.name}</Heading1>
        <TableContainer>
          <table>
            <thead>
              <tr>
                <TableRowHeader>Nafn</TableRowHeader>
                <TableRowHeader>Vörumerki</TableRowHeader>
                <TableRowHeader>Stutt lýsing</TableRowHeader>
                <TableRowHeader>Löng lýsing</TableRowHeader>
                <TableRowHeader>Slóð á vörumynd</TableRowHeader>
                <TableRowHeader>Slóð á vöru á vef söluaðila</TableRowHeader>
                {/* <TableRowHeader>Slóð á EPD skjal</TableRowHeader>
                <TableRowHeader>Slóð á VOC skjal</TableRowHeader>
                <TableRowHeader>Slóð á FSC skjal</TableRowHeader>
                <TableRowHeader>Slóð á CE skjal</TableRowHeader> */}
              </tr>
            </thead>
            <tbody>
              {productsState.map((prodDict) => {
                return Object.entries(prodDict).map(([key,value]) => {
                  const thisProduct: ProductProps = value
                  console.log('thisProduct', thisProduct)
                  return(
                    <tr key={key}>
                      <TableRowBody>
                        {thisProduct.title}
                      </TableRowBody>
                      <TableRowBody>
                        {thisProduct.brand}
                      </TableRowBody>
                      <TableRowBody>
                        {thisProduct.shortdescription}
                      </TableRowBody>
                      <TableRowBody>
                        {thisProduct.description}
                      </TableRowBody>
                      <TableRowBody>
                        {thisProduct.productimageurl}
                      </TableRowBody>
                      <TableRowBody>
                        {thisProduct.url}
                      </TableRowBody>
                      {/* <TableRowBody>
                        {thisProduct.epdUrl}
                      </TableRowBody>
                      <TableRowBody>
                        {thisProduct.vocUrl}
                      </TableRowBody>
                      <TableRowBody>
                        {thisProduct.fscUrl}
                      </TableRowBody>
                      <TableRowBody>
                        {thisProduct.ceUrl}
                      </TableRowBody> */}
                    </tr>
                  )
                })
              })}
            </tbody>
          </table>
        </TableContainer>


      </PageContainer>
      <Footer />
    </Page>
  )
}

export default Product

const TableContainer = styled.div`
  overflow-x:auto
`

const TableRowHeader = styled.th`
  border-top: 1px solid #000;
`

const TableRowBody = styled.td`
  border-top: 1px solid #000;
`


const EditableProduct = styled.div`
  display: flex;
  flex-direction:row;
  border-bottom:1px solid #000;
`

const EditableProductItem = styled.div`
  border-left:1px solid #000;
`

const ProductsTable = styled.div`
  display:flex;
  flex-direction:column;
`

const CertImageWrapper = styled.div`
  position: relative;
  height: 80px;
  width: 100px;
  display:flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SingleCertificateItem = styled.div`
  display:flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;
  margin: 0 10px;

  @media ${mediaMax.tablet}{
    margin-bottom:60px;
  }
`

const ProductCertifications = styled.div`
  width:100%;
  background-color: ${({ theme }) => theme.colors.beige};
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  padding: 35px 0 45px 0;
  margin-top:150px;
`

const CertificateList = styled.div`
  display:flex;
  flex-direction:row;

  @media ${mediaMax.tablet}{
    flex-direction:column;
  }
`

const ProductCategories = styled.div`
  display:flex;
  flex-direction:column;
`

const PageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding-bottom:200px;
`

const StyledHeader = styled(Header)`
  margin-bottom:225px;
`

const Page = styled.div`
  min-height:100vh;
  background-color: ${({ theme }) => theme.colors.grey_one};
`

const ProductInfo = styled.div`
  width: 100%;
  display:flex;
  flex-direction:row;
  
  @media ${mediaMax.tablet}{
    flex-direction:column;
    padding: 0 20px;
  }
`

const ProductInfoLeft = styled.div`
  width:50%;

  @media ${mediaMax.tablet}{
    width: 100%;
    margin-bottom: 40px;
  }
`

const ProductInfoRight = styled.div`
  width:50%;

  @media ${mediaMax.tablet}{
    width: 100%;
  }
`

const ProductText = styled.p`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
`


const ImageWrapper = styled.div`
  height: 430px;
  width:80%;
  margin: 0 auto;
  position:relative;
`