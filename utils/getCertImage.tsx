import React from 'react'
import styled from "styled-components"
import Image from 'next/image'
import SvanurinnLogoSVG from '../components/Svg/Logos/Svanurinn'
import VocLogoSVG from '../components/Svg/Logos/Voc'

export const getCertImage = (cert: string) => {
  switch(cert){
    case 'EPD':
      const a = <CertImageWrapper><Image src='/epdLogo.png' layout="fill" objectFit="contain" /></CertImageWrapper>
      return a
    case 'FSC':
      return <CertImageWrapper><Image src='/FSC_LOGO.jpg' layout="fill" objectFit="contain" /></CertImageWrapper>
    case 'SV':
      return <CertImageWrapper><SvanurinnLogoSVG /></CertImageWrapper>
    case 'VOC':
      return <CertImageWrapper><VocLogoSVG /></CertImageWrapper>
    case 'SV_ALLOWED':
      return <CertImageWrapper><Image src='/leyfilegt-svansvottad.png' layout="fill" objectFit="contain" /></CertImageWrapper>
    case 'EV':
      return <CertImageWrapper><Image src='/Euroblume_logo.svg.png' layout="fill" objectFit="contain" /></CertImageWrapper>
    // case 'CE':
    //   return <CertImageWrapper><Image src='/ce_logo.png' layout="fill" objectFit="contain" /></CertImageWrapper>
    case 'BLENGILL':
      return <CertImageWrapper><Image src='/blue_angel_logo.png' layout="fill" objectFit="contain" /></CertImageWrapper>
  }
}


const CertImageWrapper = styled.div`
  position: relative;
  height: 80px;
  width: 100px;
  display:flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

