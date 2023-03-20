import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { Heading1, Heading5 } from '../components/Typography';
import { Drawer, Button } from 'antd';
import { HomeFilled,
        ProfileFilled,
        ToolFilled,
        SearchOutlined,
        RightOutlined,
        LeftOutlined,
        DownOutlined,
        UserOutlined, 
        PlusOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import Link from 'next/link';
import VistbokLogo from '../components/Svg/VistbokLogo';
import { motion, useAnimation } from "framer-motion";
import { useRouter } from 'next/router';


interface User {
  fullName?: string
  email: string
  company?: string
  jobTitle?: string
  password: string
}

const minarsidur = () => {

  const [user, setUser] = useState<User>(null)
  const [open, setOpen] = useState(true);
  const [dropDownOpen, setDropDownOpen] = useState(false);

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

  const onClose = () => {
    setOpen(!open);
  };

  // const onCloseDropDown = () => {
  //   setDropDownOpen(!dropDownOpen);
  //   console.log('dropdown open', dropDownOpen)
  // };
  
  return(
    <Page>
      <PageContainer>
        {/* <StyledHeader showSearch={true} /> */}
        {!!user && <ContentContainer>
          {open ? <Drawer
            placement="left"
            closable={false}
            onClose={onClose}
            visible={open}
            width='300px'
            mask={false}
            headerStyle={{ backgroundColor:'#ABC5A1' }}
            bodyStyle={{ backgroundColor:'#ABC5A1' }}
          >
            <SideContainer
              // animate={drawerControls}
            >
              <DrawerHeaderContainer>
                <Link href="/" passHref>
                  <a>
                    <VistbokLogo style={{cursor:'pointer'}} width="150px"/>
                  </a>
                </Link>
                <LeftOutlined onClick={() => onClose()} style={{ fontSize: '30px', paddingLeft:'10px'}}/>
              </DrawerHeaderContainer>
              <DrawerHeadingContainer>
                <HomeFilled style={{ fontSize: '18px'}} />
                <DrawerText> Mitt svæði </DrawerText>
              </DrawerHeadingContainer>
              <Sideline></Sideline>
              <DrawerHeadingContainer style={{ paddingBottom:'10px' }}>
                <ProfileFilled style={{ fontSize: '18px'}} />
                <DrawerText> Mín verkefni </DrawerText>
              </DrawerHeadingContainer>
              <DrawerHeadingContainer>
                <ToolFilled style={{ fontSize: '18px'}}/>
                <DrawerText> Mínar vörur </DrawerText>
              </DrawerHeadingContainer>
              <DrawerHeadingContainer style={{ paddingTop:'20px' }}>
                <SearchOutlined style={{ fontSize: '18px', color: '#1976D2' }} />
                <DrawerText style={{ color: '#1976D2' }} > Leitarvél </DrawerText>
              </DrawerHeadingContainer>
            </SideContainer >
          </Drawer> : 
          <Drawer
            placement="left"
            closable={false}
            onClose={onClose}
            visible={!open}
            width='80px'
            mask={false}
            headerStyle={{ backgroundColor:'#ABC5A1' }}
            bodyStyle={{ backgroundColor:'#ABC5A1' }}
          >
            <SideContainer 
              style={{ width:'30px' }}
              // animate={drawerControls}
            >
              <DrawerHeaderContainer>
                <RightOutlined onClick={() => onClose()} style={{ fontSize: '30px', paddingLeft:'10px'}}/>
              </DrawerHeaderContainer>
              <HomeFilled style={{ fontSize: '18px', paddingTop:'20px' }} />
              <ProfileFilled style={{ fontSize: '18px', paddingTop:'10px' }} />
              <ToolFilled style={{ fontSize: '18px', paddingTop:'10px' }}/>
              <SearchOutlined style={{ fontSize: '18px', paddingTop:'10px' }} />
            </SideContainer>
          </Drawer>
          }
          {/* {!open &&
            <Link href="/" passHref>
              <a>
                <VistbokLogo style={{cursor:'pointer'}} width="150px"/>
              </a>
            </Link>
          } */}
          <UserHeader >
            <UsernameContainer>
              <UserOutlined style={{ fontSize: '20px' }}/>
              <StyledHeading5 style={{ width: '180px', marginLeft:'10px' }}> {user.fullName}</StyledHeading5> 
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
              <MainHeading> {user.fullName}</MainHeading>
              <StyledHeading5> {user.company}</StyledHeading5> 
              <StyledHeading5> {user.jobTitle}</StyledHeading5> 
            </UserCardContainer>
            <MyProjectsContainer>
              <StyledHeading5> Mín verkefni </StyledHeading5>
              <Button style={{marginRight:"12px", width:"100px", color:"#ABC5A1"}}>Í vinnslu <DownOutlined /> </Button>
              <Button style={{marginRight:"20px", width:"140px", backgroundColor:"#ABC5A1"}} type="primary" >Búa til verkefni <PlusOutlined /> </Button>
            </MyProjectsContainer>
          </InformationContainer>
        </ContentContainer>}
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
  flex-direction:row;
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

const DrawerHeaderContainer = styled.div`
  display:flex;
  flex-direction: row;
  padding-bottom:20px;
`

const DrawerHeadingContainer = styled.div`
  display:flex;
  flex-direction: row;
  // width:90%;
  // padding-bottom:10px;
`

const DrawerText = styled(Heading5)`
  text-align:center;
  font-size: 18px;
  padding-left:10px;
`

const Sideline = styled.div`
  height:1px;
  width: 180px;
  background-color:black;
  margin-bottom:10px;
  margin-top:4px;
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

export default minarsidur