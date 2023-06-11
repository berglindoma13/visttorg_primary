import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { Heading1, Heading5 } from '../components/Typography';
import { Drawer, Button } from 'antd';
import Link from 'next/link';
import VistbokLogo from '../components/Svg/VistbokLogo';
import { MyPagesSidebar } from '../components/Drawer/MyPagesSidebar'
import { UserOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import { motion, useAnimation } from "framer-motion";
import { useRouter } from 'next/router';

interface User {
    fullName?: string
    email: string
    company?: string
    jobTitle?: string
    password: string
}


const minarvorur = () => {

    const [user, setUser] = useState<User>(null)
    const [open, setOpen] = useState(true);
  
    const router = useRouter()

    useEffect(() => {
        const token = sessionStorage.getItem('jwttoken');
        if(!!token){
          const decoded: any = jwt_decode(token);
          console.log("decoded", decoded);
          setUser({ fullName: decoded.fullname, jobTitle: decoded.jobtitle, company: decoded.company, email: decoded.email, password: decoded.password })
        }
        else {
          // reroute user to the login site when not logged in
          router.push('/login')
        }
      }, [])
    
      //Framer motion controls for showing and hiding filter drawer
      const pageContentControls = useAnimation()
        
      useEffect(() => {
        if(open){
          pageContentControls.start({
            x: "0px",
            width: '75%',
            marginLeft:'340px',
            transition: { duration : 0.2 }
          })
        }
        else if(!open){
          pageContentControls.start({
            x: "20px",
            width: '85%',
            transition: { duration : 0.2 },
            marginLeft:'120px'
          })
        }
      }, [open])

    const onChange = () => {
        setOpen(!open);
    };

    return(
    <Page>
      <PageContainer>
            <MyPagesSidebar onClick={onChange} open={open} />
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
                <StyledHeading5> Mínar Vörur </StyledHeading5>
          </InformationContainer>
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

export default minarvorur