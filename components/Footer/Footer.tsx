import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { mediaMax } from '../../constants/breakpoints'
import { TextInput } from '../Inputs'
import FacebookIcon from '../Svg/Facebook'
import { Heading3, Heading5 } from '../Typography'

export const Footer = () => {

  const [postlistEmail, setPostlistEmail] = useState('')
  const [postlistDone, setPostlistDone] = useState(false)

  useEffect(() => {
    const postlistset = localStorage.getItem('postlist')
    if(!!postlistset){
      setPostlistDone(true)
    }
  }, [])

  const addToPostlist = () => {
    localStorage.setItem('postlist', 'true')

    fetch('/api/postlist/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postlistEmail,
      }),
    })
  }

  return(
    <FooterContainer>
      <FooterContent>
        <TopContent>
          <FooterTitle>Allar umhverfisvottaðar byggingavörur á einum stað</FooterTitle>
          <FooterSubText>Viltu vera memm ? <a href="mailto:vistbok@visttorg.is" >Hafðu samband</a></FooterSubText>
        </TopContent>
        <BottomContent>
          <BottomContentLeft>2022©</BottomContentLeft>
          <BottomContentRight>
            <a href='https://www.facebook.com/Vistbok' target='_blank'><FacebookIcon /></a>
          </BottomContentRight>
          <BottomContentMid>
            <PostlistTitle>Viltu vera á póstlista?</PostlistTitle>
            {postlistDone ? (
              <Heading3>Þú ert nú þegar skráð/ur á póstlista</Heading3>
            ) : (
              <TextInput placeholder="netfang" onSubmit={() => addToPostlist()} onChange={(e) => setPostlistEmail(e.target.value)}></TextInput>
            )}
          </BottomContentMid>
        </BottomContent>
      </FooterContent>
    </FooterContainer>
  )
}

const FooterContainer = styled.div`
  height: fit-content;
  width:100%;
  background-color: ${({ theme }) => theme.colors.beige};
`

const FooterContent = styled.div`
  padding: 30px 0px 15px 0;
  max-width: 1440px;
  margin: 0 auto;

  @media(max-width: 1440px){
    padding: 30px 35px 15px 35px;
  }

  @media ${mediaMax.tablet}{
    padding: 40px 35px 15px 35px;
  }
  
`

const FooterTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: normal;
  font-size: 64px;
  line-height: 104%;
  letter-spacing: -0.025em;
  flex:1;
  color: ${({ theme }) => theme.colors.orange};
  margin-right:80px;
  
  @media ${mediaMax.tablet}{
    font-size: 36px;
  }
`

const FooterSubText = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 36px;
  line-height: 104%;
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.colors.grey_five};

  a{
    text-decoration-line: underline;
  }

  @media ${mediaMax.tablet}{
    font-size: 24px;
    margin-top:20px;
  }
`

const TopContent = styled.div`
  display:flex;
  margin-bottom:85px;
  display:flex;
  flex-direction:row;

  @media ${mediaMax.tablet}{
    flex-direction:column;
  }
`

const BottomContent = styled.div`
  display:flex;
  flex-direction: row;
  align-items: flex-end;
`

const BottomContentLeft = styled(Heading5)`
  flex:1;
`

const BottomContentRight = styled.div`
  flex:1;
  display:flex;
  flex-direction:row;
  justify-content: flex-start;

  >a{
    height:24px;
  }

  @media ${mediaMax.tablet}{
    flex:0;
  }
`

const BottomContentMid = styled.div`
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content: flex-end;
`

const PostlistTitle = styled(Heading5)`
  margin-bottom: 10px;
`