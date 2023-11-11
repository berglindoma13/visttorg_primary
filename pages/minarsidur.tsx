import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { Heading1, Heading5, Heading2, Heading3, H3 } from '../components/Typography';
import { TextInput } from '../components/Inputs'
import { Button, Modal, Select, Dropdown, Layout  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
// import Link from 'next/link';
import { motion, useAnimation } from "framer-motion";
import { useRouter } from 'next/router';
import { MyPagesSidebar } from '../components/Drawer/MyPagesSidebar'
import { prismaInstance } from '../lib/prisma'
import axios, { AxiosError } from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { theme } from '../styles';
import InteriorDesign from '../components/Svg/ProjectIcons/InteriorDesign';
import HomeOne from '../components/Svg/ProjectIcons/HomeOne';
import HomeFour from '../components/Svg/ProjectIcons/HomeFour';
import HomeFive from '../components/Svg/ProjectIcons/HomeFive';
import HomeThree from '../components/Svg/ProjectIcons/HomeThree';
import HomeSix from '../components/Svg/ProjectIcons/HomeSix';
import HomeTwo from '../components/Svg/ProjectIcons/HomeTwo';
import { ProjectStates } from '../constants/projectStates';
import { projectStatesMapper } from '../mappers/projectStates';
import { Spin } from 'antd';
import '../styles/globalStyles';

interface User {
  fullname?: string
  email: string
  company?: string
  jobtitle?: string
  password: string
}

interface SingleProject {
  title: string
  certificatesystem: string
  address: string
  country: string
  status?: string
  id: string
}

interface CertificateSystem {
  value: string
  label: string
}

interface AllProjects {
  count: number
  projects: Array<SingleProject>
}

interface MinarSidurProps {
  user: User
  projectList: Array<SingleProject>
  certificateSystemList?: Array<CertificateSystem>
}

const formInitValues = {title:"", certificatesystem:"", address:"", country:"", id: ""}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const currentUser = context.req.cookies?.vistbokUser ? context.req.cookies?.vistbokUser : null

  let user : User = null
  let email: string = null
  if(currentUser){
    user = jwt_decode(currentUser)
    email = user.email
  } 

  let projectList = null

  if(email){
    // ALL PROJECTS
    projectList = await prismaInstance.vistbokProject.findMany({
      where: {
        ownerEmail: email
      }
    });
  }

  // Get list of certificate systems
  const certificateSystems = await prismaInstance.certificatesystem.findMany({});
  const filteredcertificateSystems = certificateSystems.map(cert => {
    return {value: cert.name, label: cert.name}
  })

  return {
    props: {
      user: user,
      projectList: projectList,
      certificateSystemList: filteredcertificateSystems,
    }
  }
}

const MinarSidur = ({ user, projectList, certificateSystemList } : MinarSidurProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newProjectParam, setNewProjectParam] = useState<SingleProject>(formInitValues)
  const [projects, setProjects] = useState<AllProjects>({count: projectList && projectList?.length, projects: projectList ? projectList : []})

  const router = useRouter()

  useEffect(() => {
    console.log('user', user)
    if(!user){
      //TODO: Fix this
      router.push('/login')
    }
  }, [])

  const onProjectCreation = () => {
    // console.log('new project to create', newProjectParam)
    axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/addproject`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        title: newProjectParam.title,
        certificatesystem: newProjectParam.certificatesystem,
        address: newProjectParam.address,
        country: newProjectParam.country,
        status: ProjectStates.NotStarted.toString(),
        ownerEmail: user.email,
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.data;
      }

      throw new Error(response.statusText);
    })
    .then((responsejson) => {
      setProjects({count: projects.count+1, projects: [...projects.projects, {...newProjectParam, id: responsejson}]})
      setNewProjectParam(formInitValues);
      setIsLoading(false);
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
    setIsLoading(true);
    onProjectCreation()
  };

  const handleCancelModal = () => {
    // if user cancels or closes modal
    setNewProjectParam(formInitValues);
    setIsModalOpen(false);
  };

  const viewProject = (item : SingleProject) => {
    router.push({pathname:`/verkefni/${item.id}`, })
  }

  const getProjectIcon = (index: number) => {
    switch(index){
      case 0: return <HomeOne height="100%" width="100%"/>
      case 1: return <HomeTwo height="100%" width="100%"/>
      case 2: return <HomeThree height="100%" width="100%"/>
      case 3: return <HomeFour height="100%" width="100%"/>
      case 4: return <HomeFive height="100%" width="100%"/>
      case 5: return <HomeSix height="100%" width="100%"/>
    }
  }
  
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
          <Layout>
            <InformationContainer>
              { user && (<UserCardContainer>
                <MainHeading> {user.fullname}</MainHeading>
                <Heading3> {user.company}</Heading3> 
                <Heading3> {user.jobtitle}</Heading3> 
              </UserCardContainer>)}
              <MyProjectsContainer>
                <MyProjectsHeader>
                  <StyledHeading2> Mín verkefni {isLoading && <Spin size="large" />} </StyledHeading2>
                  {/* <Button style={{marginRight:"12px", width:"100px", color:theme.colors.black, fontFamily: theme.fonts.fontFamilySecondary}}>Í vinnslu <DownOutlined color={theme.colors.black} /> </Button> */}
                  <Button style={{marginRight:"20px", width:"140px", backgroundColor: theme.colors.black, fontFamily: theme.fonts.fontFamilySecondary}} type="primary" onClick={showModal} >Búa til verkefni <PlusOutlined /> </Button>
                </MyProjectsHeader>
                <MyProjectsContent>
                { isModalOpen && <Modal 
                  open={isModalOpen}
                  bodyStyle={{ backgroundColor: theme.colors.tertiary.base}} 
                  style={{ borderRadius: 8}}
                  closable={false}
                  footer={[
                    <Button onClick={handleCancelModal} style={{ backgroundColor: theme.colors.grey_two, color: 'black', fontFamily: theme.fonts.fontFamilySecondary, margin: '10px 0px 10px 0px'}} type="primary" >Hætta við</Button>,
                    <Button onClick={handleOkModal} style={{ backgroundColor: theme.colors.green, fontFamily: theme.fonts.fontFamilySecondary}} type="primary" >Búa til</Button>,
                  ]}
                >
                  <ModalContent >
                    <MainHeading style={{fontSize: "28px", color: "#fff"}}> Nýtt verkefni </MainHeading>
                    <StyledInput 
                        placeholder='Titill'
                        onChange={(input) => {setNewProjectParam({...newProjectParam, title:input.target.value})}}
                        value={newProjectParam.title}
                    />
                    <Select
                      placeholder="Vottunarkerfi"
                      style={{ width: '100%', borderRadius:'999px', background: '#FAFAFA', height: '40px', paddingTop: '5px', fontWeight:'700', letterSpacing: '0.09em', fontSize: '14px'}}
                      dropdownStyle={{borderRadius: '20px', background: 'white', fontFamily: theme.fonts.fontFamilySecondary, fontWeight:'700', letterSpacing: '0.09em', fontSize: '14px'}}
                      onChange={(input) => {setNewProjectParam({...newProjectParam, certificatesystem:input})}}
                      options={certificateSystemList}
                    />
                    <StyledInput 
                        placeholder='Heimilisfang'
                        onChange={(input) => {setNewProjectParam({...newProjectParam, address:input.target.value})}}
                        value={newProjectParam.address}
                    />
                    <StyledInput 
                        placeholder='Land'
                        onChange={(input) => {setNewProjectParam({...newProjectParam,country:input.target.value})}}
                        value={newProjectParam.country}
                    />
                    <Select
                      placeholder="Staða verks"
                      style={{ width: '100%', borderRadius:'999px', background: '#FAFAFA', height: '40px', paddingTop: '5px', fontFamily: theme.fonts.fontFamilySecondary, fontWeight:'700', letterSpacing: '0.09em', fontSize: '14px'}}
                      dropdownStyle={{borderRadius: '20px', fontFamily: theme.fonts.fontFamilySecondary, fontWeight:'700', letterSpacing: '0.09em', fontSize: '14px'}}
                      onChange={(input) => {setNewProjectParam({...newProjectParam, status:input.value})}}
                      options={getProjectStateOprions()}
                    />
                  </ModalContent>
                </Modal>}
                {projects.count !== 0 && projects.projects.map((item, index) => {
                  return(
                  <ProjectCard key={item.title} onClick={() => viewProject(item)}>
                    <SideBox>
                      {getProjectIcon(index)}
                    </SideBox>
                    <ProjectInformation>
                      <StyledHeading3> {item.title} </StyledHeading3>
                      <StyledHeading5>{`Vottunarkerfi: ${item.certificatesystem}`}</StyledHeading5>
                      <StyledHeading5> Heimilisfang: {item.address} </StyledHeading5>
                      <StyledHeading5> Land: {item.country} </StyledHeading5>
                      <StyledHeading5> Staða: {projectStatesMapper[item.status]} </StyledHeading5>
                    </ProjectInformation>
                  </ProjectCard>)
                })}
                </MyProjectsContent>
              </MyProjectsContainer>
            </InformationContainer>
          </Layout>
        </Layout>      
    </Page>
  )
}

export default MinarSidur

const Page = styled.div`
  background-color: ${({ theme }) => theme.colors.grey_one};
  min-height:100vh;
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

const ProjectInformation = styled.div`

`

const SideBox = styled.div`
  height: 120px;
  width: 120px;
  background-color:${({ theme }) => theme.colors.lightGreen};
  margin-left: -90px;
  margin-right:20px;
  box-shadow: 0px 4px 26px 10px rgba(154,154,154,0.1);
  border-radius: 16px;
  padding: 0px 10px 0px 10px;
`

const InformationContainer = styled(motion.div)`
 
`

const UserCardContainer = styled.div`
  height:30vw;
  width:100vw;
  display: flex;
  flex-direction: column;
  align-items:flex-start;
  padding-left:40px;
  padding-top:40px;
  background-image:url('/wave_v5.svg');
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 30vh;

  ${Heading3}{
    font-size: 20px;
    margin-bottom:10px;
    font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  }
`

const MyProjectsContainer = styled.div`
  display:flex;
  flex-direction:column;
  padding-left:40px;
`

const MyProjectsHeader = styled.div`
  display:flex;
  flex-direction:row;
`

// css for all project cards together
const MyProjectsContent = styled.div`
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  width:100%;
  justify-content: flex-start;
  height: 100%;
`

// css for a single project card
const ProjectCard = styled.div`
  padding: 20px 30px 20px 30px;
  margin: 15px 30px 15px 60px;
  min-width: 250px;
  width: 30%;
  height: auto;
  max-height: 510px;
  box-shadow: 0px 4px 26px 10px rgba(154, 154, 154, 0.1);
  border-radius: 16px;
  display:flex;
  flex-direction:row;
  align-items:center;
  position:relative;
  transition: box-shadow 0.2s ease-in;
  cursor: pointer;
`

const MainHeading = styled(Heading1)`
  font-size: 48px;
  width:100%;
  padding-bottom:15px;

`

const StyledHeading2 = styled(Heading2)`
  padding-bottom:10px;
  width:100%;

  .ant-spin-dot-item {
    background-color: #ABC5A1;
  }

`

const StyledHeading3 = styled(Heading3)`
  font-size: 28px;
  padding-top:10px;
  padding-bottom:15px;
`

const StyledHeading5 = styled(Heading5)`
  padding-bottom:10px;
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: lighter;
  font-size: 16px;
  white-space: nowrap;
  width:100%;
`

const StyledInput = styled(TextInput)`
  margin-bottom:20px;
  margin-top:20px;
`