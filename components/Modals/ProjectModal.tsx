import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Modal, Button, Select } from 'antd'
import { HomeFilled } from '@ant-design/icons';
import { Heading1, Heading5 } from '../Typography';
import VistbokLogo from '../Svg/VistbokLogo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TextInput } from '../Inputs'




interface ProjectModalProps {
    text?: string
    className?: string
    certList: Array<CertificateSystem>
    onClick: () => void
    handleCancel: () => void
    open: boolean
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

export const ProjectModal = ({ text, className, certList, onClick, handleCancel, open }: ProjectModalProps) => {
  
  // const [open, setOpen] = useState(true);
  const [newProjectParam, setNewProjectParam] = useState<SingleProject>({title:"", certificatesystem:"", address:"", country:""})

  const router = useRouter()

  // const onChange = () => {
  //   setOpen(!open);
  // };

//   const drawerNav = (log: string) => {
//     router.push(log)
//   };


  return (
    <div>
        <Modal open={open} onOk={onClick} onCancel={handleCancel}>
            <div >
                <MainHeading style={{fontSize: "28px"}}> {text} </MainHeading>
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
                options={certList}
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

const StyledInput = styled(TextInput)`
  margin-bottom:20px;
  margin-top:20px;
  // background: green;
`

const MainHeading = styled(Heading1)`
  font-size: 48px;
  width:100%;
  padding-bottom:6px;
`