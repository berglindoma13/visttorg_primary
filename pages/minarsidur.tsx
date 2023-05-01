import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Header } from '../components/Header'
import { Heading1, Heading5 } from '../components/Typography';
import { Button } from 'antd';
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
// import Link from 'next/link';
import { motion, useAnimation } from "framer-motion";
import { useRouter } from 'next/router';
import { MyPagesSidebar } from '../components/Drawer/MyPagesSidebar'
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

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  console.log('currentUser', context.req.cookies.vistbokUser)

  const currentUser = context.req.cookies.vistbokUser

  const user = jwt_decode(currentUser)

  return {
    props: {
       user
    }
  }
}

interface MinarSidurProps {
  user: User
}

const MinarSidur = ({ user }: MinarSidurProps ) => {
  const router = useRouter()

  useEffect(() => {
    console.log('user', user)
    if(!user){
      console.log('in here')
      router.push('/login')
    }
  }, [])

  const [open, setOpen] = useState(true);
  // const [dropDownOpen, setDropDownOpen] = useState(false);

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

  const onChange = () => {
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
          <MyPagesSidebar onClick={onChange} open={open} />
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

const DrawerItemContainer = styled.div`
  display:flex;
  flex-direction: row;
  // width:90%;
  // padding-bottom:10px;
  cursor: pointer;
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