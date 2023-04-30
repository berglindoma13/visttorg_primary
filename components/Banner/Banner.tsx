import React from 'react'
import styled from 'styled-components'
import MagnifyingGlass from '../Svg/MagnifyingGlass'
import { Heading1, Heading4 } from '../Typography'
// import EarthImage from '../../public/Earth.png'
import EarthImage from '../../public/Earth.svg'
import Image from 'next/image'
import { mediaMax } from '../../constants/breakpoints'

export const Banner = (props: any) => {
  return(
    <BannerWrapper {...props}>
      <BannerLeftContent>
        <StyledHeading1>Við spörum þér leitina</StyledHeading1>
        <Heading4>Umhverfisvænar byggingarvörur á einum stað</Heading4>
        {/* <FakeInputWrapper>
          <StyledMagnifyingGlass />
          <FakeTextInputButton href='#search'>
            <FakeTextInputText>Leita eftir vöru</FakeTextInputText>
          </FakeTextInputButton>
        </FakeInputWrapper> */}
      </BannerLeftContent>
      <BannerRightContent>
        <Image src={EarthImage} alt='Grafík af jörðinni'/>
      </BannerRightContent>
    </BannerWrapper>
  )
}

const BannerWrapper = styled.div`
  padding: 42px 11% 50px 5%;
  width:100%;
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  align-items: center;;
  margin-bottom:50px;
  background-color: ${({ theme }) => theme.colors.primary.light};

  @media ${mediaMax.tablet}{
    flex-direction:column;
    padding: 40px 23px 0 23px;
    margin-bottom:45px;
  }
`

const StyledHeading1 = styled(Heading1)`
  margin-bottom: 30px;
`

const BannerLeftContent = styled.div`
  @media ${mediaMax.tablet}{
    margin-bottom:35px;
  }
`

const BannerRightContent = styled.div`
  width: 400px;

  @media ${mediaMax.tablet}{
    width:212px;
  }
`

const FakeTextInputText = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 14px;
  line-height: 104%;
  letter-spacing: 0.09em;
  /* font-variant: small-caps; */
  color: ${({ theme }) => theme.colors.grey_five};
`

const FakeTextInputButton = styled.a`
  height: 40px;
  max-width:390px;
  width:100%;
  display:flex;
  flex-direction:row;
  align-items:center;
  padding-left:50px;
  position:relative;
  background: #FAFAFA;
  box-shadow: 0px 4px 26px 10px rgba(154, 154, 154, 0.1);
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 14px;
  line-height: 104%;
  letter-spacing: 0.09em;
  color: ${({ theme }) => theme.colors.grey_five};

  &:hover{
    ${FakeTextInputText}{
      color: ${({ theme }) => theme.colors.green};
    }
  }
`

const StyledMagnifyingGlass = styled(MagnifyingGlass)`
  position:absolute;
  left:18px;
  top:11px;
  z-index:2;
`

const FakeInputWrapper = styled.div`
  height: 40px;
  width:100%;
  position:relative;

  &:hover{
    ${StyledMagnifyingGlass}{
      fill: ${({ theme }) => theme.colors.green};
    }
  }
  
`

