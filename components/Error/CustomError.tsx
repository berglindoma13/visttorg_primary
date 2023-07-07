import React from 'react'
import styled from 'styled-components';
import { Header } from '../Header';
import { Heading1, Heading3, Heading6 } from '../Typography';
import EarthImage from '../../public/Earth.svg';
import Image from 'next/image';
import { mediaMax } from '../../constants/breakpoints';
import Link from 'next/link';
import ArrowVector from '../Svg/ArrowVector';

interface CustomErrorProps {
  title: string
  errorCode?: string
  description: string
  redirectUrl: string
} 

export const CustomError = ({ title, description, redirectUrl, errorCode }: CustomErrorProps) => {
  return (
    <Page>
        <PageContainer>
            <StyledHeader showSearch={false} />
            <HeaderContainer>
                <Image src={EarthImage} alt='Grafík af jörðinni'/>
            </HeaderContainer>
            {errorCode && <StyledHeading3>{errorCode}</StyledHeading3>}
            <MainHeading>{title}</MainHeading>
            <ButtonWrapper>
                <Link href={redirectUrl}>
                     <ArrowVector/>
                </Link>
                <Link href={redirectUrl}>
                    <StyledHeading6>{description}</StyledHeading6>
                </Link>
            </ButtonWrapper>
        </PageContainer>
    </Page>
  )
}

const Page = styled.div`
    background-color: ${({ theme }) => theme.colors.grey_one};
    min-height:100vh;
`

const PageContainer = styled.div`
    display:flex;
    flex-direction:column;
    align-items: center;
    max-width: 1440px;
    margin: 0 auto;
    padding-bottom:200px;
`

const HeaderContainer = styled.div`
    width: 288px;
    padding-bottom: 30px;
    @media ${mediaMax.tablet}{
      width:212px;
    }
`

const StyledHeader = styled(Header)`
    margin-bottom:50px;
`

const MainHeading = styled(Heading1)`
    max-width:930px;
    width:100%;
    text-align:center;
    margin: 0 auto;
    padding-bottom:50px;
`

const StyledHeading3 = styled(Heading3)`
    text-align:center;
    padding-bottom: 30px;
`

const StyledHeading6 = styled(Heading6)`
    text-align:center;
    color: #BDBDBD;
    padding-left: 10px;
    text-decoration: underline;
`

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction; row;
    cursor:pointer;
`