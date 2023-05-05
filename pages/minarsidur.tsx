import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { Heading1, Heading5 } from '../components/Typography';
import { TextInput } from '../components/Inputs'
import { Button, Modal, Select } from 'antd';
import { DownOutlined,
        UserOutlined, 
        PlusOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
// import Link from 'next/link';
import { motion, useAnimation } from "framer-motion";
import { useRouter } from 'next/router';
import { MyPagesSidebar } from '../components/Drawer/MyPagesSidebar'
import { prismaInstance } from '../lib/prisma'
import axios, { AxiosError } from 'axios';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { login } from '../app/features/auth/authSlice';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

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

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  // console.log('currentUser', context.req.cookies.vistbokUser)

  const currentUser = context.req.cookies.vistbokUser

  const user : User = jwt_decode(currentUser)

  const email = user.email

  // ALL PROJECTS
  const projectList = await prismaInstance.vistbokProject.findMany({
    where: {
      ownerEmail: email
    }
  });

  // Get list of certificate systems
  const certificateSystems = await prismaInstance.certificatesystem.findMany({});
  const filteredcertificateSystems = certificateSystems.map(cert => {
    return {value: cert.name, lable: cert.name}
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

  // const [user, setUser] = useState<User>(null)
  const [open, setOpen] = useState(true);
  // const [dropDownOpen, setDropDownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectParam, setNewProjectParam] = useState<SingleProject>({title:"", certificatesystem:"", address:"", country:""})

  const [projects, setProjects] = useState<AllProjects>({count:projectList.length,projects:projectList})


  // const [open, setOpen] = useState(true);
  // const [dropDownOpen, setDropDownOpen] = useState(false);

  const router = useRouter()

  useEffect(() => {
    console.log('user', user)
    if(!user){
      console.log('in here')
      router.push('/login')
    }
  }, [])

  const onProjectCreation = () => {
    console.log('new project to create', newProjectParam)
    axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/addproject`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        title: newProjectParam.title,
        certificatesystem: newProjectParam.certificatesystem,
        address: newProjectParam.address,
        country: newProjectParam.country,
        status: "In progress",
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

  //Framer motion controls for showing and hiding filter drawer
  const pageContentControls = useAnimation()
  const drawerControls = useAnimation()
    
  useEffect(() => {
    if(open){
      pageContentControls.start({
        x: "0px",
        width: '75%',
        marginLeft:'340px',
        transition: { duration : 0.2 }
      })

      drawerControls.start({
        opacity: 0.5,
        transition: { duration : 0.4 }
      })

    }
    else if(!open){
      pageContentControls.start({
        x: "20px",
        width: '85%',
        transition: { duration : 0.2 },
        marginLeft:'120px'
      })

      drawerControls.start({
        width:'30px',
        opacity: 1,
        transition: { duration : 0.4 },
      })
    }
  }, [open])

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOkModal = () => {
    // if user presses ok
    setIsModalOpen(false);
    setProjects({count: projects.projects.length+1, projects: [...projects.projects, newProjectParam] })
    console.log(" projects", projects)
    onProjectCreation()
  };

  const handleCancelModal = () => {
    // if user cancels or closes modal
    setIsModalOpen(false);
  };

  const onChangeSidebar = () => {
    console.log("count", projects.count)
    setOpen(!open);
  };

  // fyrir útskráningu
  // const onCloseDropDown = () => {
  //   setDropDownOpen(!dropDownOpen);
  //   console.log('dropdown open', dropDownOpen)
  // };
  
  return(
    <Page>
      <PageContainer>
        {/* <StyledHeader showSearch={true} /> */}
        {!!user && <ContentContainer>
          <MyPagesSidebar onClick={onChangeSidebar} open={open} />
          <UserHeader >
            <UsernameContainer>
              <UserOutlined style={{ fontSize: '20px' }}/>
              <StyledHeading5 style={{ width: '180px', marginLeft:'10px' }}> {user.fullname}</StyledHeading5> 
              {/* <NavItem onClick={() => onCloseDropDown()}>
                <DownOutlined />
              </NavItem> */}
            </UsernameContainer>
          </UserHeader>
          <InformationContainer 
            style={{ marginLeft: open ? '340px' : '120px' }}
            animate={pageContentControls}
            // transition={{ type: "Tween" }}
          >
            <StyledHeading5> Mitt svæði </StyledHeading5>
            <UserCardContainer>
              <MainHeading> {user.fullname}</MainHeading>
              <StyledHeading5> {user.company}</StyledHeading5> 
              <StyledHeading5> {user.jobtitle}</StyledHeading5> 
            </UserCardContainer>
            <MyProjectsContainer>
              <MyProjectsHeader>
                <StyledHeading5> Mín verkefni </StyledHeading5>
                <Button style={{marginRight:"12px", width:"100px", color:"#ABC5A1"}}>Í vinnslu <DownOutlined /> </Button>
                <Button style={{marginRight:"20px", width:"140px", backgroundColor:"#ABC5A1"}} type="primary" onClick={showModal} >Búa til verkefni <PlusOutlined /> </Button>
              </MyProjectsHeader>
              <MyProjectsContent>
              <Modal open={isModalOpen} onOk={handleOkModal} onCancel={handleCancelModal}>
                <div >
                  <MainHeading style={{fontSize: "28px"}}> Nýtt verkefni </MainHeading>
                  {/* <StyledHeading5> Titill </StyledHeading5> */}
                  <StyledInput 
                      placeholder='Titill'
                      onChange={(input) => {setNewProjectParam({title:input.target.value,certificatesystem:newProjectParam.certificatesystem, address:newProjectParam.address,country:newProjectParam.country})}}
                      value={newProjectParam.title}
                  />
                  {/* <StyledHeading5> Vottunarkerfi </StyledHeading5> */}
                  <Select
                    placeholder="Vottunarkerfi"
                    style={{ width: '100%' }}
                    // onChange={handleChangeSelect}
                    onChange={(input) => {setNewProjectParam({title:newProjectParam.title,certificatesystem:input,address:newProjectParam.address,country:newProjectParam.country})}}
                    options={certificateSystemList}
                  />
                  {/* <StyledHeading5> Nánar um vottunarkerfi </StyledHeading5> */}
                  {/* <StyledHeading5> Heimilisfang </StyledHeading5> */}
                  <StyledInput 
                      placeholder='Heimilisfang'
                      onChange={(input) => {setNewProjectParam({title:newProjectParam.title,certificatesystem:newProjectParam.certificatesystem, address:input.target.value,country:newProjectParam.country})}}
                      value={newProjectParam.address}
                  />
                  {/* <StyledHeading5> Land </StyledHeading5> */}
                  <StyledInput 
                      placeholder='Land'
                      onChange={(input) => {setNewProjectParam({title:newProjectParam.title,certificatesystem:newProjectParam.certificatesystem, address:newProjectParam.address,country:input.target.value})}}
                      value={newProjectParam.country}
                  />
                </div>
              </Modal>
              {projects.count !== 0 && projects.projects.map((item) => {
                return(
                <ProjectCard key={item.title}>
                  <MainHeading style={{fontSize: "28px"}}> {item.title} </MainHeading>
                  <StyledHeading5> Vottunarkerfi: {item.certificatesystem} </StyledHeading5>
                  <StyledHeading5> Heimilisfang: {item.address} </StyledHeading5>
                  <StyledHeading5> Land: {item.country} </StyledHeading5>
                  <StyledHeading5> Staða: {item.status} </StyledHeading5>
                </ProjectCard>)
              })}
              </MyProjectsContent>
            </MyProjectsContainer>
          </InformationContainer>
        </ContentContainer>}
      </PageContainer>
    </Page>
  )
}

export default MinarSidur

const Page = styled.div`
  background-color: ${({ theme }) => theme.colors.grey_one};
  min-height:100vh;
`

const PageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding-bottom:200px;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const UserHeader = styled.div`
  height:70px;
  max-width: 1440px;
  border-bottom:groove;
  border-width: 3px;
  border-color: light-grey;
  margin-bottom:50px;
  display: flex;
  align-items: center;
`

const UsernameContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width:97%;
`

const SideContainer = styled(motion.div)`
  // background-color:${({ theme }) => theme.colors.green};
  width:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const InformationContainer = styled(motion.div)`
  // padding-left:40px;
`

const UserCardContainer = styled.div`
  height:24vh;
  width:42vw;
  border:solid;
  // margin:10px;
  margin:30px 0px 30px 0px;
  padding: 25px 25px 25px 40px;
  display: flex;
  flex-direction: column;
  // justify-content:flex-start;
  align-items:center;
  justify-content: center;
`

const MyProjectsContainer = styled.div`
  display:flex;
  flex-direction:column;
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
  // background: #d3d3d3;
  background: #FFFFFF;
  // height:200px;
  // width:180px;
  margin: 15px 30px 15px 0px;
  min-width: 250px;
  width: 18%;
  height: auto;
  max-height: 510px;
  box-shadow: 0px 4px 26px 10px rgba(154, 154, 154, 0.1);
  border-radius: 16px;
  display:flex;
  flex-direction:column;
  padding: 12px;
  position:relative;
  transition: box-shadow 0.2s ease-in;
  cursor: pointer;
  padding-bottom:40px;

`

const StyledHeader = styled(Header)`
  margin-bottom:50px;
`

const MainHeading = styled(Heading1)`
  font-size: 48px;
  width:100%;
  padding-bottom:6px;
`

const StyledHeading5 = styled(Heading5)`
  padding-bottom:4px;
  width:100%;
`

const StyledInput = styled(TextInput)`
  margin-bottom:20px;
  margin-top:20px;
  // background: green;
`

const NavItem = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 16px;
  line-height: 104%;
  letter-spacing: 0.09em;
  /* font-variant: small-caps; */
  color: #000000;
  cursor: pointer;
  padding-bottom: 8px;

  &:hover{
    color: ${({ theme }) => theme.colors.green};
  }
`