import React from 'react'
import { Menu, Layout } from 'antd'
import { HomeFilled,
  ProfileFilled,
  StarOutlined,
  SearchOutlined,
  SettingOutlined
 } from '@ant-design/icons';
import VistbokLogo from '../Svg/VistbokLogo';
import { useRouter } from 'next/router';
import { theme } from '../../styles';

const { Sider } = Layout;

export const MyPagesSidebar = () => {

  const router = useRouter()

  const useRoute = (log: string) => {
    router.push(log)
  };

  return (
      <Sider 
        trigger={null} 
        collapsible
        collapsed={false}
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
            },
            {
              key: '1',
              icon:  <HomeFilled style={{ fontSize: '18px'}} color="#fff"/>,
              label: 'Mitt svæði',
              style: { color: '#fff', backgroundColor: 'transparent', marginTop: 20 },
              onClick: () => useRoute('/minarsidur')
            },
            // {
            //   key: '2',
            //   icon: <ProfileFilled style={{ fontSize: '18px'}} color="#fff" />,
            //   label: 'Mín verkefni',
            //   style: { color: '#fff', backgroundColor: 'transparent' },
            //   onClick: () => useRoute('/')
            // },
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
            },
            {
              key: '5',
              icon:  <SettingOutlined style={{ fontSize: '18px' }} color="#fff"/>,
              label: 'Stillingar',
              style: { color: '#fff', backgroundColor: 'transparent' },
              onClick: () => useRoute('/')
            }
          ]}
        />
      </Sider>
      )  
}