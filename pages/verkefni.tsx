import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { Heading1, Heading5 } from '../components/Typography';
import { Drawer, Button, Modal, Select } from 'antd';
import Link from 'next/link';
import { MyPagesSidebar } from '../components/Drawer/MyPagesSidebar'
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import { motion, useAnimation } from "framer-motion";
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios, { AxiosError } from 'axios';
import { prismaInstance } from '../lib/prisma'
import { TextInput } from '../components/Inputs'


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
  status?: string
}

interface VerkefniProps {
  user: User
  certificateSystemList?: Array<CertificateSystem>
}


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  // console.log('currentUser', context.req.cookies.vistbokUser)

  const currentUser = context.req.cookies.vistbokUser

  const user : User = jwt_decode(currentUser)

    // Get list of certificate systems
    const certificateSystems = await prismaInstance.certificatesystem.findMany({});
    const filteredcertificateSystems = certificateSystems.map(cert => {
      return {value: cert.name, lable: cert.name}
    })

  return {
    props: {
        user: user,
        certificateSystemList: filteredcertificateSystems,
    }
  }
}

const verkefni = ({ user, certificateSystemList } : VerkefniProps) => {

    // const [user, setUser] = useState<User>(null)
    const [open, setOpen] = useState(true);
    const [myProject, setMyProject] = useState<SingleProject>({title:"", certificatesystem:"", address:"", country:"", status:""})
  
    const [originalTitle, setOriginalTitle] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter()

    useEffect(() => {
      const { page, query, cat } = router.query

      setMyProject({title: router.query.title, certificatesystem: router.query.certificatesystem, address: router.query.address, country: router.query.country, status: router.query.status  })
      setOriginalTitle(router.query.title)

      console.log('user', user)
      if(!user){
        console.log('in here')
        router.push('/login')
      }
    }, [])
    
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

    const onProjectUpdate = () => {
        // console.log('original tilte', originalTitle)
        axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/updateproject`, {
          headers: { 'Content-Type': 'application/json' },
          data: {
            oldTitle: originalTitle,
            title: myProject.title,
            certificatesystem: myProject.certificatesystem,
            address: myProject.address,
            country: myProject.country,
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
        //update path
        router.push({pathname:'/verkefni', query: {title: myProject.title, certificatesystem: myProject.certificatesystem, address: myProject.address, country: myProject.country, status: myProject.status}})
    };

    const onDeleteProject = () => {
         axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://vistbokserver.herokuapp.com'}/api/deleteproject`, {
            headers: { 'Content-Type': 'application/json' },
            data: {
              title: myProject.title,
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

    return(
    <Page>
      <PageContainer>
            {!!user && <div>
            <MyPagesSidebar onClick={onChangeSidebar} open={open} />
            <UserHeader >
                <UsernameContainer>
                    <UserOutlined style={{ fontSize: '20px' }}/>
                    <StyledHeading5 style={{ width: '180px', marginLeft:'10px' }}> {"María"}</StyledHeading5> 
                </UsernameContainer>
            </UserHeader>
            <InformationContainer 
                style={{ marginLeft: open ? '340px' : '120px' }}
                animate={pageContentControls}
            >
                <StyledHeading5> Mín Verkefni </StyledHeading5>
                <ProjectContainer>
                    <div>
                        <MainHeading> {myProject.title} </MainHeading>
                        <StyledHeading5> Vottunarkerfi: {myProject.certificatesystem} </StyledHeading5>
                        <StyledHeading5> Heimilisfang: {myProject.address} </StyledHeading5>
                        <StyledHeading5> Land: {myProject.country} </StyledHeading5>
                        <StyledHeading5> Staða: {myProject.status} </StyledHeading5>
                    </div>
                    <div style={{position: 'absolute', right: '0', paddingRight:'18px' }}>
                        <EditOutlined onClick={() => showModal()} style={{marginRight:'14px'}} />
                        <DeleteOutlined onClick={() => onDeleteProject()} />
                    </div>
                </ProjectContainer>
            </InformationContainer>
            <Modal open={isModalOpen} onOk={handleOkModal} onCancel={handleCancelModal}>
                <div >
                  <MainHeading style={{fontSize: "28px"}}> Nýtt verkefni </MainHeading>
                  {/* <StyledHeading5> Titill </StyledHeading5> */}
                  <StyledInput 
                      placeholder='Titill'
                      onChange={(input) => {setMyProject({title:input.target.value,certificatesystem:myProject.certificatesystem, address:myProject.address,country:myProject.country})}}
                      value={myProject.title}
                  />
                  {/* <StyledHeading5> Vottunarkerfi </StyledHeading5> */}
                  <Select
                    placeholder={myProject.certificatesystem}
                    style={{ width: '100%' }}
                    // onChange={handleChangeSelect}
                    onChange={(input) => {setMyProject({title:myProject.title,certificatesystem:input,address:myProject.address,country:myProject.country})}}
                    options={certificateSystemList}
                  />
                  {/* <StyledHeading5> Nánar um vottunarkerfi </StyledHeading5> */}
                  {/* <StyledHeading5> Heimilisfang </StyledHeading5> */}
                  <StyledInput 
                      placeholder='Heimilisfang'
                      onChange={(input) => {setMyProject({title:myProject.title,certificatesystem:myProject.certificatesystem, address:input.target.value,country:myProject.country})}}
                      value={myProject.address}
                  />
                  {/* <StyledHeading5> Land </StyledHeading5> */}
                  <StyledInput 
                      placeholder='Land'
                      onChange={(input) => {setMyProject({title:myProject.title,certificatesystem:myProject.certificatesystem, address:myProject.address,country:input.target.value})}}
                      value={myProject.country}
                  />
                </div>
              </Modal>
            <InformationContainer 
                style={{ marginLeft: open ? '340px' : '120px' }}
                animate={pageContentControls}
            >
                <StyledHeading5> Vörur </StyledHeading5>
            </InformationContainer>
            </div>}
      </PageContainer>
    </Page>
  )
}

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

const InformationContainer = styled(motion.div)`
  // padding-left:40px;
  margin-top:20px;
`

const StyledInput = styled(TextInput)`
  margin-bottom:20px;
  margin-top:20px;
  // background: green;
`


const ProjectContainer = styled(motion.div)`
    background: #FFFFFF;
    margin: 15px 30px 15px 0px;
    min-width: 250px;
    width: 37%;
    height: auto;
    max-height: 510px;
    box-shadow: 0px 4px 26px 10px rgba(154, 154, 154, 0.1);
    border-radius: 16px;
    display:flex;
    flex-direction:row;
    padding: 22px 0px 22px 34px;
    position:relative;
    transition: box-shadow 0.2s ease-in;
    cursor: pointer;
`

const MainHeading = styled(Heading1)`
  font-size: 48px;
  width:100%;
  padding-bottom:6px;
`

const UsernameContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width:97%;
`

const StyledHeading5 = styled(Heading5)`
  padding-bottom:4px;
  width:100%;
`

export default verkefni