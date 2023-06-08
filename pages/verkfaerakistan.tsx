import React from 'react'
import styled from 'styled-components'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Heading1, H4, Heading3, H1, Heading4, Heading5 } from '../components/Typography'
import { MainButton } from '../components/Buttons'
import { theme } from '../styles/theme'

const Toolbox = () => {
  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch={false} />
        <MainHeading> Verkfærakistan </MainHeading>
        <StyledHeading4> Hér má finna gagnlega hlekki. </StyledHeading4>
        <FullWidthLowBox style={{backgroundColor:theme.colors.beige}}>
            <StyledHeading5> Heimasíða Grænni byggðar þar sem hægt er að nálgast meðal annars útgefið efni um Breeam vottunarkerfið. </StyledHeading5>
            <MainButton
                text={'Grænni Byggð'}
                isLink
                href={'https://www.graennibyggd.is/utgefid-efni-vistvottunarkerfi'}
            />
        </FullWidthLowBox>
        <FullWidthLowBox>
            <StyledHeading5> Hlekkur á kröfubók Breeam sem verið er að nota á Íslandi í dag. </StyledHeading5>
            <MainButton
                text={'Kröfubók Breeam'}
                isLink
                href={'https://files.bregroup.com/breeam/technicalmanuals/BREEAMInt2016SchemeDocument/#09_material/mat03.htm%3FTocPath%3D10.0%2520Materials%7C_____3'}
            />
        </FullWidthLowBox>
        <FullWidthLowBox style={{backgroundColor:theme.colors.beige}}>
            <StyledHeading5> Heimasíða Svansinns. Þar má finna allar upplýsingar sem tengjast svansvottunarferlinu. Helstu upplýsingar og kröfur eru undir “ítarefni”. </StyledHeading5>
            <MainButton
                text={'Svanurinn'}
                isLink
                href={'https://svanurinn.is/'}
            />
        </FullWidthLowBox>
        <FullWidthLowBox>
            <StyledHeading5> Heimasíða Visthúss, fyrsta svansvottaðar húsið á Íslandi. Hjónin Finnur og Þórdís deila svansvottunarferlinu. </StyledHeading5>
            <MainButton
                text={'Visthús'}
                isLink
                href={'https://visthus.is/'}
            />
        </FullWidthLowBox>
      </PageContainer>
      <Footer />
    </Page>
  )
}

export default Toolbox

const PageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding-bottom:200px;
`

const Page = styled.div`
  background-color: ${({ theme }) => theme.colors.grey_one};
  min-height:100vh;
  padding-top:92px;
`

const StyledHeader = styled(Header)`
  margin-bottom:50px;
`

const MainHeading = styled(Heading1)`
  max-width:930px;
  width:100%;
  text-align:center;
  margin: 0 auto;
`

const StyledHeading4 = styled(Heading4)`
  max-width:490px;
  width:100%;
  text-align:center;
  margin: 0 auto;
  margin-top:50px;
  padding-bottom:30px;
`

const StyledHeading5 = styled(Heading5)`
  max-width:800px;
  width:100%;
  text-align:center;
  margin: 0 auto;
  padding-bottom:20px;
`

const FullWidthLowBox = styled.div`
  height: 145px;
  width:100%;
//   background-color: ${({ theme }) => theme.colors.beige};
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
`
