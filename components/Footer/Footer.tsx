import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { mediaMax } from '../../constants/breakpoints'
import { TextInput } from '../Inputs'
import FacebookIcon from '../Svg/Facebook'
import { Heading4, Heading5 } from '../Typography'

export const Footer = () => {

  const [postlistEmail, setPostlistEmail] = useState('')
  const [postlistDone, setPostlistDone] = useState(false)

  const [inputError, setInputError] = useState('')

  useEffect(() => {
    const postlistset = localStorage.getItem('postlist')
    if(!!postlistset){
      setPostlistDone(true)
    }
  }, [])

  const addToPostlist = async() => {

    fetch('/api/postlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postlistEmail
      })
    }).then((response) => {
      console.log('response', response)
      
      if (response.ok) {
        return;
      }

      throw new Error(response.statusText);
    })
    .then(() => {
      console.log('successful adding to postlist')
      localStorage.setItem('postlist', 'true')
    })
    .catch((error) => {
      console.log('error adding to postlist', error.message)
      //TODO get the .send() to work in Postlist api in express to get the correct error message through the server
      // setInputError(error.message)
      setInputError('Villa við skráningu, vinsamlegast reyndu aftur')
    });
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
              <Heading5>Takk fyrir skráninguna, þú ert skráð/ur á póstlistann</Heading5>
            ) : (
              <Wrapper>
                <TextInput placeholder="netfang" onSubmit={() => addToPostlist()} onChange={(e) => setPostlistEmail(e.target.value)}></TextInput>
                <SubmitButton onClick={() => addToPostlist()}>Skrá</SubmitButton>
                {inputError && <StyledError>{inputError}</StyledError>}
              </Wrapper>
            )}
          </BottomContentMid>
        </BottomContent>
      </FooterContent>
    </FooterContainer>
  )
}

const StyledError = styled.span`
  color:red;
  font-size: 12px;
  max-width: 70%;
  display: block;
  margin-top: 5px;
  margin-left: 10px;
`

const Wrapper = styled.div`
  position:relative;
`

const SubmitButton = styled.button`
  position:absolute;
  z-index: 2;
  top:5px;
  right:5px;
  border:none;
  background-color: ${({ theme }) => theme.colors.green};
  height:30px;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  width:60px;
`

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

const PostlistTitle = styled(Heading4)`
  margin-bottom: 10px;
`