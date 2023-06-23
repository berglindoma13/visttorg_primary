import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../../components/Header'
import { Heading1, Heading3, Heading5 } from '../../components/Typography';
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
import { ProjectStates } from '../../constants/ProjectStates';
import { projectStatesMapper } from '../../mappers/projectStates';


interface User {
    fullName?: string
    email: string
    company?: string
    jobTitle?: string
    password: string
}

interface CertificateSystem {
    value: string
    label: string
}

interface SingleProject {
  title: string
  certificatesystem: string
  address: string
  country: string
  status?: number
  id: string
}

interface VerkefniProps {
  user: User
  certificateSystemList?: Array<CertificateSystem>
  thisProject: SingleProject
}


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const id = context.query.id !== undefined ? context.query.id.toString() : ''

    const currentUser = context.req.cookies.vistbokUser

    const user : User = jwt_decode(currentUser)

    // Get list of certificate systems
    const certificateSystems = await prismaInstance.certificatesystem.findMany({});
    const filteredcertificateSystems = certificateSystems.map(cert => {
      return {value: cert.name, lable: cert.name}
    })

    const thisProject = await prismaInstance.vistbokProject.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    return {
        props: {
            user,
            certificateSystemList: filteredcertificateSystems,
            thisProject
        }
    }
}

const verkefni = ({ user, certificateSystemList, thisProject } : VerkefniProps) => {

    // const [user, setUser] = useState<User>(null)
    const [open, setOpen] = useState(true);
    const [myProject, setMyProject] = useState<SingleProject>(thisProject)
  
    const [originalTitle, setOriginalTitle] = useState(thisProject.title);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter()

    useEffect(() => {
      const { page, query, cat } = router.query

    //   setMyProject({title: router.query.title, certificatesystem: router.query.certificatesystem, address: router.query.address, country: router.query.country, status: router.query.status  })
    //   setOriginalTitle(router.query.title)

      if(!user){
        router.push('/login')
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
          // væri til í að sleppa þessu og bara gera þetta þegar að axios post er búið
          setTimeout(() => {
            router.push('/minarsidur')
          }, 1000)
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

    const onChangeSidebar = () => {
        setOpen(!open);
    };

    const getProjectStateOprions = () => {
      const options = []
      for (const key in ProjectStates) {
        const option = {value: ProjectStates[key], label: projectStatesMapper[ProjectStates[key]]}
        options.push(option)
      }
  
      return options
    }

    return(
    <Page>
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
            <InformationContainer>
              <ProjectCardContainer>
                <MainHeading> {myProject.title}</MainHeading>
                <Heading3>Vottunarkerfi: {myProject.certificatesystem}</Heading3> 
                <Heading3> Heimilisfang: {myProject.address} </Heading3> 
                <Heading3> Land: {myProject.country} </Heading3> 
                <Heading3> Staða: {projectStatesMapper[myProject.status]} </Heading3> 
              </ProjectCardContainer>
            </InformationContainer>
            <Modal open={isModalOpen} onOk={handleOkModal} onCancel={handleCancelModal}>
                <MainHeading style={{fontSize: "28px"}}> Breyta verkefni </MainHeading>
                <StyledInput 
                    placeholder='Titill'
                    onChange={(input) => {setMyProject({...myProject, title:input.target.value})}}
                    value={myProject.title}
                />
                <Select
                  placeholder={myProject.certificatesystem}
                  style={{ width: '100%' }}
                  onChange={(input) => {setMyProject({...myProject, certificatesystem:input})}}
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
                    style={{ width: '100%' }}
                    onChange={(input) => {setMyProject({...myProject, status:input})}}
                    value={projectStatesMapper[myProject.status]}
                    options={getProjectStateOprions()}
                  />
              </Modal>
            <InformationContainer>
                <StyledHeading5> Vörur </StyledHeading5>
            </InformationContainer>
          </Layout>
      </Layout>
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

const ProjectActions = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`

const InformationContainer = styled.div`

`

const StyledInput = styled(TextInput)`
  margin-bottom:20px;
  margin-top:20px;
`

const MainHeading = styled(Heading1)`
  font-size: 48px;
  width:100%;
  padding-bottom:15px;
`

const StyledHeading5 = styled(Heading5)`
  padding-bottom:4px;
  width:100%;
`

export default verkefni