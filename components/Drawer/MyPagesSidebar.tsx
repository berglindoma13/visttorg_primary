import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Drawer, Button } from 'antd'
import { HomeFilled,
  ProfileFilled,
  ToolFilled,
  SearchOutlined,
  RightOutlined,
  LeftOutlined,
  DownOutlined,
  UserOutlined, 
  PlusOutlined } from '@ant-design/icons';
import { Heading1, Heading5 } from '../Typography';
import VistbokLogo from '../Svg/VistbokLogo';
import Link from 'next/link';
import { useRouter } from 'next/router';



interface MyPagesSidebarProps {
    text?: string
    className?: string
    onClick: () => void
    open: boolean
}

export const MyPagesSidebar = ({ text, className, onClick, open }: MyPagesSidebarProps) => {
  
  // const [open, setOpen] = useState(true);

  const router = useRouter()

  // const onChange = () => {
  //   setOpen(!open);
  // };

  const drawerNav = (log: string) => {
    router.push(log)
  };

  return (
    <div>
        {open ? <Drawer
            placement="left"
            closable={false}
            onClose={onClick}
            open={open}
            width='300px'
            mask={false}
            headerStyle={{ backgroundColor:'#ABC5A1' }}
            bodyStyle={{ backgroundColor:'#ABC5A1' }}
          >
            <SideContainer>
              <DrawerHeaderContainer>
                <Link href="/" passHref>
                  <a>
                    <VistbokLogo style={{cursor:'pointer'}} width="150px"/>
                  </a>
                </Link>
                <LeftOutlined onClick={onClick} style={{ fontSize: '30px', paddingLeft:'10px'}}/>
              </DrawerHeaderContainer>
              <DrawerItemContainer onClick={() => drawerNav("/minarsidur")}>
                <HomeFilled style={{ fontSize: '18px'}} />
                <DrawerText> Mitt svæði </DrawerText>
              </DrawerItemContainer>
              <Sideline></Sideline>
              <DrawerItemContainer onClick={() => drawerNav("/minverkefni")} style={{ paddingBottom:'10px' }}>
                <ProfileFilled style={{ fontSize: '18px'}} />
                <DrawerText> Mín verkefni </DrawerText>
              </DrawerItemContainer>
              <DrawerItemContainer onClick={() => drawerNav("/minarvorur")}>
                <ToolFilled style={{ fontSize: '18px'}}/>
                <DrawerText> Mínar vörur </DrawerText>
              </DrawerItemContainer>
              <DrawerItemContainer style={{ paddingTop:'20px' }}>
                <SearchOutlined style={{ fontSize: '18px', color: '#1976D2' }} />
                <DrawerText style={{ color: '#1976D2' }} > Leitarvél </DrawerText>
              </DrawerItemContainer>
            </SideContainer >
          </Drawer> : 
          <Drawer
            placement="left"
            closable={false}
            onClose={onClick}
            open={!open}
            width='80px'
            mask={false}
            headerStyle={{ backgroundColor:'#ABC5A1' }}
            bodyStyle={{ backgroundColor:'#ABC5A1' }}
          >
            <SideContainer 
              style={{ width:'30px' }}
            >
              <DrawerHeaderContainer>
                <RightOutlined onClick={onClick} style={{ fontSize: '30px', paddingLeft:'10px'}}/>
              </DrawerHeaderContainer>
              <HomeFilled style={{ fontSize: '18px', paddingTop:'20px' }} />
              <ProfileFilled style={{ fontSize: '18px', paddingTop:'10px' }} />
              <ToolFilled style={{ fontSize: '18px', paddingTop:'10px' }}/>
              <SearchOutlined style={{ fontSize: '18px', paddingTop:'10px' }} />
            </SideContainer>
          </Drawer>
          }
    </div>
  )
}

const SideContainer = styled.div`
  // background-color:${({ theme }) => theme.colors.green};
  width:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
