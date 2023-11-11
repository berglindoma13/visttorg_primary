import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../../components/Header'
import { Heading1, Heading3, Heading2 } from '../../components/Typography';
import { Drawer, Button, Modal, Select, Layout } from 'antd';
import Link from 'next/link';
import { MyPagesSidebar } from '../../components/Drawer/MyPagesSidebar'
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import { motion, useAnimation } from "framer-motion";
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios, { AxiosError } from 'axios';
import { prismaInstance } from '../../lib/prisma'
import { TextInput } from '../../components/Inputs'
import { ProjectStates } from '../../constants/projectStates';
import { projectStatesMapper } from '../../mappers/projectStates';
import { Project } from '../../types/projects';
import { User } from '../../types/auth';
import { CustomError } from '../../components/Error/CustomError';
import { ProductProps } from '../../types/products';
import superjson from 'superjson'
import ProductTable from '../../components/ProductTable';
import { theme } from '../../styles';

interface CertificateSystem {
    value: string
    label: string
}
interface VerkefniProps {
  user: User
  certificateSystemList?: Array<CertificateSystem>
  thisProject: Project
  productString: string
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const id = context.query.id !== undefined ? context.query.id.toString() : ''

    const currentUser = context.req.cookies?.vistbokUser ? context.req.cookies?.vistbokUser : null

    let user : User = null
    if(currentUser){
      user = jwt_decode(currentUser)
    } 

    // Get list of certificate systems
    const certificateSystems = await prismaInstance.certificatesystem.findMany({});
    const filteredcertificateSystems = certificateSystems.map(cert => {
      return {value: cert.name, lable: cert.name}
    })

    const thisProject = await prismaInstance.vistbokProject.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
          owner: true
        }
    })

    let mappedProductIds = []

    await prismaInstance.productsInProjects.findMany({
      where: {
        projectId: parseInt(id)
      }
    }).then((products) => {
      console.log('products', products)
      mappedProductIds = products.map(x => x.productId)
    })  

    console.log('mappedPrductsIds', mappedProductIds)

    const mappedProducts = await prismaInstance.product.findMany({
      where: {
        id: {
          in: mappedProductIds
        }
      },
      include: {
        sellingcompany: true,
        categories : true,
        subCategories: true,
        certificateSystems: true,
        certificates: {
          include: {
            certificate : true
          }
        }
      },
    })

    const productsJSONString = superjson.stringify(mappedProducts)

    // Exclude keys from user 
    const exclude = (user: User, key: string) => {
        return Object.fromEntries(
          Object.entries(user).filter(([userKey]) => userKey !== key)
        )
    }

    const userWithoutPassword = exclude(thisProject.owner as User, 'password')

    const project = {...thisProject, owner: userWithoutPassword}

    return {
        props: {
            user,
            certificateSystemList: filteredcertificateSystems,
            thisProject: project,
            productString: productsJSONString
        }
    }
}

const verkefni = ({ user, certificateSystemList, thisProject, productString } : VerkefniProps) => {
    
    const productsInProject: Array<ProductProps> = superjson.parse(productString)
    const [showError, setShowError] = useState(false)

    if(!!user && thisProject.owner.id !== user.id){
      console.log('error here', user, thisProject.owner.id, user.id)
      // setShowError(true)
    }

    const [open, setOpen] = useState(true);
    const [myProject, setMyProject] = useState<Project>(thisProject)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter()

    console.log('myProject', myProject)

    useEffect(() => {
      if(!user){
      //  router.push('/login')
      }
    }, [])
    
    const onProjectUpdate = () => {
        axios.put(
            `${process.env.NODE_ENV === 'development' ?
             'http://localhost:8000' :
              'https://vistbokserver.herokuapp.com'}/api/updateproject/${myProject.id}`, {
          headers: { 'Content-Type': 'application/json' },
          data: {
            title: myProject.title,
            certificatesystem: myProject.certificatesystem,
            address: myProject.address,
            country: myProject.country,
            status: myProject.status.toString(),
            ownerEmail: user.email,
          }
        }).then((response) => {
          if (response.status === 200) {
            return response.data;
          }
    
          throw new Error(response.statusText);
        })
        .then((responsejson) => {
          console.log('success', responsejson);
        })
        .catch((err: Error | AxiosError) => {
          console.log("error", err)
        })
    };

    //TODO: Vantar "staðfesta" modal þegar notandi ýtir á eyða takkann
    const onDeleteProject = () => {
         axios.delete(
             `${process.env.NODE_ENV === 'development' ?
              'http://localhost:8000' :
               'https://vistbokserver.herokuapp.com'}/api/deleteproject/${myProject.id}`, {
            headers: { 'Content-Type': 'application/json' },
          }).then((response) => {
              console.log('response.status ', response.status)
            if (response.status === 200) {
              return response.data;
            }
      
            throw new Error(response.statusText);
          })
          .then((responsejson) => {
            console.log('success', responsejson);
            router.push('/minarsidur')
          })
          .catch((err: Error | AxiosError) => {
            console.log("error", err)
          })
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleOkModal = () => {
        // if user presses ok
        setIsModalOpen(false);
        onProjectUpdate()
    };
    
    const handleCancelModal = () => {
        // if user cancels or closes modal
        setIsModalOpen(false);
    };

    const getProjectStateOprions = () => {
      const options = []
      for (const key in ProjectStates) {
        const option = {value: ProjectStates[key], label: projectStatesMapper[ProjectStates[key]]}
        options.push(option)
      }
  
      return options
    }

    console.log('productsInProject', productsInProject)
    return(
    <Page>
      {showError ? (
        <CustomError 
          title="Aðgangsvilla"
          description='Þú hefur því miður ekki aðgang að þessu verkefni'
          errorCode='401'
          redirectUrl='/minarsidur'
        />
      ) : (
        <Layout>
            <MyPagesSidebar/>
            <ProjectActions>
                <EditOutlined 
                  style={{ fontSize: "24px", marginRight: '15px'}}
                  onClick={() => showModal()} 
                />
                <DeleteOutlined 
                  style={{ fontSize: "24px"}} 
                  onClick={() => onDeleteProject()} 
                />
            </ProjectActions>
            <Layout>
              <ProjectCardContainer>
                <StyledHeading1>{myProject.title}</StyledHeading1>
                <Heading3>Vottunarkerfi: {myProject.certificatesystem}</Heading3> 
                <Heading3>Heimilisfang: {myProject.address}</Heading3> 
                <Heading3>Land: {myProject.country}</Heading3> 
                <Heading3>Staða: {projectStatesMapper[myProject.status]}</Heading3> 
              </ProjectCardContainer>
              <Modal 
                open={isModalOpen} 
                bodyStyle={{ backgroundColor: theme.colors.tertiary.base}} 
                style={{ borderRadius: 8}}
                closable={false}
                footer={[
                  <Button onClick={handleCancelModal} style={{ backgroundColor: theme.colors.grey_two, color: 'black', fontFamily: theme.fonts.fontFamilySecondary, margin: '10px 0px 10px 0px'}} type="primary" >Hætta við</Button>,
                  <Button onClick={handleOkModal} style={{ backgroundColor: theme.colors.green, fontFamily: theme.fonts.fontFamilySecondary}} type="primary" >Breyta</Button>,
                ]}
              >
                  {/* <ModalHeading> Breyta verkefni </ModalHeading> */}
                  <ModalContent>
                    <MainHeading style={{fontSize: "28px", color: "#fff"}}> Breyta verkefni </MainHeading>
                    <StyledInput 
                        placeholder='Titill'
                        onChange={(input) => {setMyProject({...myProject, title:input.target.value})}}
                        value={myProject.title}
                    />
                    <Select
                      placeholder={myProject.certificatesystem}
                      style={{ width: '100%', borderRadius:'999px', background: '#FAFAFA', height: '40px', paddingTop: '5px', fontWeight:'700', letterSpacing: '0.09em', fontSize: '14px'}}
                      dropdownStyle={{borderRadius: '20px', background: 'white', fontFamily: theme.fonts.fontFamilySecondary, fontWeight:'700', letterSpacing: '0.09em', fontSize: '14px'}}
                      onChange={(input) => {
                       
                        setMyProject({...myProject, certificatesystem:input})}}
                      options={certificateSystemList}
                    />
                    <StyledInput 
                        placeholder='Heimilisfang'
                        onChange={(input) => {setMyProject({...myProject, address:input.target.value})}}
                        value={myProject.address}
                    />
                    <StyledInput 
                        placeholder='Land'
                        onChange={(input) => {setMyProject({...myProject, country:input.target.value})}}
                        value={myProject.country}
                    />
                    <Select
                        placeholder="Staða verks"
                        style={{ width: '100%', borderRadius:'999px', background: '#FAFAFA', height: '40px', paddingTop: '5px', fontFamily: theme.fonts.fontFamilySecondary, fontWeight:'700', letterSpacing: '0.09em', fontSize: '14px'}}
                        dropdownStyle={{borderRadius: '20px', fontFamily: theme.fonts.fontFamilySecondary, fontWeight:'700', letterSpacing: '0.09em', fontSize: '14px'}}
                        onChange={(input) => {
                          console.log('ahhhh')
                          setMyProject({...myProject, status:input})}}
                        value={projectStatesMapper[myProject.status]}
                        options={getProjectStateOprions()}
                      />
                    </ModalContent>
                </Modal>
              <InformationContainer>
                <StyledHeading2>Vörulisti verkefnis</StyledHeading2>
                <ProductTable 
                  products={productsInProject}
                />
              </InformationContainer>
            </Layout>
        </Layout>

      )}
    </Page>
  )
}

const Page = styled.div`
  background-color: ${({ theme }) => theme.colors.grey_one};
  min-height:100vh;
`

const ProjectCardContainer = styled.div`
  height:30vw;
  width:100vw;
  display: flex;
  flex-direction: column;
  align-items:flex-start;
  padding-left:40px;
  padding-top:40px;
  background-image:url('/wave_v4.svg');
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 30vh;

  ${Heading3}{
    font-size: 20px;
    margin-bottom:10px;
    font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  }
`

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiary.base};

  .ant-select-selector {
    font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
	  color: #424242;
  }

  .ant-select-selection-item {
    font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.09em; 
  } 

`

const ProjectActions = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`

const InformationContainer = styled.div`
  padding-left:40px;
  padding-right:40px;
`

const StyledInput = styled(TextInput)`
  margin-bottom:20px;
  margin-top:20px;
`

const StyledHeading1 = styled(Heading1)`
  font-size: 48px;
  width:100%;
  padding-bottom:15px;
`

const ModalHeading = styled(Heading2)`
    padding-bottom:15px;
    font-size: 28px;
`

const MainHeading = styled(Heading1)`
  font-size: 48px;
  width:100%;
  padding-bottom:15px;
`

const StyledHeading2 = styled(Heading2)`
  padding-bottom:4px;
  width:100%;
`

export default verkefni