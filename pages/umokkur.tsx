import React from 'react'
import styled from 'styled-components'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Heading1, H4, Heading3, H1, Heading4 } from '../components/Typography'
import { theme } from '../styles/theme'
import PaintBucket from '../public/PaintBucketIcon.svg'
import Earth from '../public/Earth.svg'
import Image from 'next/image'
import { mediaMax } from '../constants/breakpoints'

const UmOkkur = () => {
  return(
    <Page>
      <PageContainer>
        <StyledHeader showSearch />
        <StyledHeader1>Fyrsti íslenski gagnabankinn fyrir umhverfisvottaðar byggingarvörur</StyledHeader1>
        <StyledHeader4>Tökum þátt í að stuðla að byggingarstarfsemi og mannvirkjagerð með lágu kolefnisspori.</StyledHeader4>
        <SplitBoxes>
          <Box color={theme.colors.orange}>
            <Heading3 style={{ textAlign: 'center' }}>
              Vistbók® einfaldar ferli umhverfisvottunnar fyrir Svaninn og Breeam
            </Heading3>
          </Box>
          <Box color={theme.colors.green}>
            <ImageWrapperSmall>
              <Image 
                src={PaintBucket} 
                alt='Paint bucket icon'
                layout="fill"
                objectFit='contain'
              />
            </ImageWrapperSmall>
          </Box>
        </SplitBoxes>
        <FullWidthLowBox>
          <Heading3 style={{textAlign:'center'}}>
            Verkefnið er unnið með heimsmarkmið Sameinuðu þjóðanna að leiðarljósi.
          </Heading3>
        </FullWidthLowBox>
        <SplitBoxes>
          <SmallerBox color="transparent">
            <FakeH1>
              Vottanir - hvað er það?
            </FakeH1>
          </SmallerBox>
          <Box color="transparent">
            <Heading4>
              Umhverfisvottanir eru staðfestingar á því að ströngum og skýrum kröfum um gæði og umhverfisþætti hefur verið fylgt í framleiðsluferli byggingarvöru. Í sumum vottunum er einnig komið í veg fyrir að varan hafi skaðleg áhrif á heilsu íbúa mannvirkis og enn aðrar vottanir gefa til kynna umhverfisáhrif yfir líftíma vörunnar.
            </Heading4>
          </Box>
        </SplitBoxes>
        <SplitBoxes>
          <Box color={theme.colors.green}>
            <ImageWrapperLarge>
              <Image
                src={Earth}
                alt='Earth icon'
                layout="fill"
                objectFit='contain'
              />
            </ImageWrapperLarge>
          </Box>
          <Box color={theme.colors.purple}>
            <FakeH1 style={{ marginBottom: 45, textAlign: 'center' }}>Við spörun þér leitina</FakeH1>
            <Heading4  style={{ textAlign:'center' }}>Hugsaðu um heilsuna, umhverfið og framtíðina með því að velja umhverfisvænar byggingarvörur</Heading4>
          </Box>
        </SplitBoxes>
      </PageContainer>
      <Footer />
    </Page>
  )
}

export default UmOkkur

const ImageWrapperLarge = styled.div`
  height:405px;
  width:330px;
  position:relative;

  @media ${mediaMax.tablet}{
    width: 100%;
    height: 310px;
  }
`

const ImageWrapperSmall = styled.div`
  height:355px;
  width:580px;
  position:relative;

  @media ${mediaMax.tablet}{
    width: 175px;
    height: 185px;
  }
`

const FakeH1 = styled.h3`
  ${H1}
`

const FullWidthLowBox = styled.div`
  height: 135px;
  width:100%;
  background-color: ${({ theme }) => theme.colors.beige};
  display:flex;
  flex-direction:row;
  justify-content: center;
  align-items: center;
`

const PageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding-bottom:200px;
`

const Page = styled.div`
  background-color: ${({ theme }) => theme.colors.grey_one};
  min-height:100vh;
`

const StyledHeader = styled(Header)`
  margin-bottom:50px;
`

const StyledHeader1 = styled(Heading1)`
  max-width:930px;
  width:100%;
  text-align:center;
  margin: 0 auto;
`

const StyledHeader4 = styled.h2`
  ${H4};
  max-width:490px;
  width:100%;
  text-align:center;
  margin: 0 auto;
  margin-top:50px;
  padding-bottom:130px;
`

const SplitBoxes = styled.div`
  width:100%;
  display:flex;
  flex-direction:row;

  @media ${mediaMax.tablet}{
    flex-direction:column;
  }
`
interface BoxProps{
  color: string
}

const SmallerBox = styled.div`
  background-color: ${({ color }) => color};
  width:50%;
  min-height: 675px;
  display:flex;
  flex-direction:row;
  justify-content: center;
  align-items: center;
  >*{
    max-width: 60%;
  }

  @media ${mediaMax.tablet}{
    width:100%;
    height: auto;
    min-height:auto;
    padding: 95px 0 45px 0;
  }
`
const Box = styled.div<BoxProps>`
  background-color: ${({ color }) => color};
  width:50%;
  min-height: 675px;
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;

  >*{
    max-width: 60%;
  }

  @media ${mediaMax.tablet}{
    width:100%;
    min-height: 355px;
  }
`