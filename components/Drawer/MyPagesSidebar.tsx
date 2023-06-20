import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Drawer, Button, Menu, Layout } from 'antd'
import { HomeFilled,
  ProfileFilled,
  StarOutlined,
  SearchOutlined
 } from '@ant-design/icons';
import { Heading5 } from '../Typography';
import VistbokLogo from '../Svg/VistbokLogo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { theme } from '../../styles';

const { Header, Sider, Content } = Layout;

interface MyPagesSidebarProps {
    text?: string
    className?: string
    onClick: () => void
    open: boolean
}

export const MyPagesSidebar = ({ text, className, onClick, open }: MyPagesSidebarProps) => {

  const router = useRouter()

  const useRoute = (log: string) => {
    router.push(log)
  };

  return (
      <Sider 
        trigger={null} 
        collapsible
        collapsed={!open}
        style={{minHeight: '100vh', backgroundColor: theme.colors.tertiary.base, paddingTop: 20}} 
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{minHeight: '100vh', backgroundColor: theme.colors.tertiary.base}}
          items={[
            { 
              key: '0',
              icon: <VistbokLogo fill="#fff" width="90%"/>,
              // style:{ paddingLeft: 0, paddingRight: 0, display:'flex', flexDirection:'row', justifyContent:'center' }
            },
            {
              key: '1',
              icon:  <HomeFilled style={{ fontSize: '18px'}} color="#fff"/>,
              label: 'Mitt svæði',
              style: { color: '#fff', backgroundColor: 'transparent', marginTop: 20 },
              onClick: () => useRoute('/minarsidur')
            },
            {
              key: '2',
              icon: <ProfileFilled style={{ fontSize: '18px'}} color="#fff" />,
              label: 'Mín verkefni',
              style: { color: '#fff', backgroundColor: 'transparent' },
              onClick: () => useRoute('/')
            },
            {
              key: '3',
              icon: <StarOutlined style={{ fontSize: '18px'}} color="#fff"/>,
              label: 'Mínar vörur',
              style: { color: '#fff', backgroundColor: 'transparent' },
              onClick: () => useRoute('/')
            },
            {
              key: '4',
              icon:  <SearchOutlined style={{ fontSize: '18px' }} color="#fff"/>,
              label: 'Leitarvél',
              style: { color: '#fff', backgroundColor: 'transparent' },
              onClick: () => useRoute('/')
            }
          ]}
        />
      </Sider>
      )
    {/* <div>
        {open ? <Drawer
            placement="left"
            closable={false}
            onClose={onClick}
            open={open}
            width='300px'
            mask={false}
            headerStyle={{ backgroundColor: theme.colors.primary.base }}
            bodyStyle={{ backgroundColor: theme.colors.primary.base }}
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
    </div> */}
  
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
