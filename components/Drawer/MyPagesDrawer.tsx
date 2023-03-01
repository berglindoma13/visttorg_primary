import React, { useEffect, useState } from 'react'
// import styled from 'styled-components'
// import { Header } from '../Header'
// import { Heading1, Heading4, Heading5 } from '../Typography';
// import { Drawer, Button } from 'antd';
// import { HomeFilled,
//         ProfileFilled,
//         ToolFilled,
//         SearchOutlined,
//         RightOutlined,
//         LeftOutlined,
//         DownOutlined } from '@ant-design/icons';
// import jwt_decode from 'jwt-decode';
// import Link from 'next/link';
// import VistbokLogo from '../Svg/VistbokLogo';
// import { mediaMax } from '../../constants/breakpoints'

// interface MyPagesDrawerProps {
//     className?: string
//     open: boolean
// }

// export const MyPagesDrawer = ({ className, open }: MyPagesDrawerProps) => {

//     const onClose = () => {
//         setOpen(!open);
//     };

//   return (
//     <Drawer
//         // title="Basic Drawer"
//         placement="left"
//         closable={false}
//         onClose={onClose}
//         visible={open}
//         // closeIcon={<LeftOutlined />}
//         width='300px'
//         mask={false}
//         headerStyle={{ backgroundColor:'#ABC5A1' }}
//         bodyStyle={{ backgroundColor:'#ABC5A1' }}
//     >
//         <SideContainer>
//             <DrawerHeaderContainer>
//             <Link href="/" passHref>
//                 <a>
//                 <VistbokLogo style={{cursor:'pointer'}} width="150px"/>
//                 </a>
//             </Link>
//             <LeftOutlined onClick={() => onClose()} style={{ fontSize: '30px', paddingLeft:'10px'}}/>
//             </DrawerHeaderContainer>
//             <DrawerHeadingContainer>
//             <HomeFilled style={{ fontSize: '18px', color: '#9C27B0' }} />
//             <DrawerText> Mitt svæði </DrawerText>
//             </DrawerHeadingContainer>
//             <Sideline></Sideline>
//             <DrawerHeadingContainer style={{ paddingBottom:'10px' }}>
//             <ProfileFilled style={{ fontSize: '18px', color: '#9C27B0' }} />
//             <DrawerText> Mín verkefni </DrawerText>
//             </DrawerHeadingContainer>
//             <DrawerHeadingContainer>
//             <ToolFilled style={{ fontSize: '18px', color: '#9C27B0' }}/>
//             <DrawerText> Mínar vörur </DrawerText>
//             </DrawerHeadingContainer>
//             <DrawerHeadingContainer style={{ paddingTop:'20px' }}>
//             <SearchOutlined style={{ fontSize: '18px', color: '#1976D2' }} />
//             <DrawerText style={{ color: '#1976D2' }} > Leitarvél </DrawerText>
//             </DrawerHeadingContainer>
//         </SideContainer >
//         </Drawer> : 
//           <Drawer
//             // title="Basic Drawer"
//             placement="left"
//             closable={false}
//             onClose={onClose}
//             visible={!open}
//             // closeIcon={<RightOutlined />}
//             width='80px'
//             mask={false}
//             headerStyle={{ backgroundColor:'#ABC5A1' }}
//             bodyStyle={{ backgroundColor:'#ABC5A1' }}
//           >
//             <SideContainer style={{ width:'30px' }}>
//               <DrawerHeaderContainer>
//                 <RightOutlined onClick={() => onClose()} style={{ fontSize: '30px', paddingLeft:'10px'}}/>
//               </DrawerHeaderContainer>
//               <HomeFilled style={{ fontSize: '18px', color: '#9C27B0', paddingTop:'20px' }} />
//               <ProfileFilled style={{ fontSize: '18px', color: '#9C27B0', paddingTop:'10px' }} />
//               <ToolFilled style={{ fontSize: '18px', color: '#9C27B0', paddingTop:'10px' }}/>
//               <SearchOutlined style={{ fontSize: '18px', color: '#9C27B0', paddingTop:'10px' }} />
//             </SideContainer>
//           </Drawer>
//   )
// }
