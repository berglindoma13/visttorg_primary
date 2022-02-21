import react, { useState } from 'react'
import styled from 'styled-components'
import Forest from '../components/Svg/Forest'
import VistbokLogo from '../components/Svg/VistbokLogo'
import Link from 'next/link'

const Home = () => {

  const [query, setQuery] = useState('')

  return(
    <PageWrapper>
      <LeftSide>
        <VistbokLogo />
        <AboutUs>Gagnabanki vistvottaðra byggingarefna</AboutUs>
        <InputWrapper>
          <StyledInput type="text" onChange={value => setQuery(value.target.value)} placeholder="Leita eftir nafni vöru" />
          <Link href={`/search?query=${query}`} passHref >
            <InputSubmitButton>Leita</InputSubmitButton>
          </Link>
        </InputWrapper>
      </LeftSide>
      <RightSide>
        <Forest />
      </RightSide>
    </PageWrapper>
  )
}

export default Home

const PageWrapper = styled.div`
  height:100vh;
  width: 100%;
  display:flex;
  flex-direction:row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.grayLight};
`

const RightSide = styled.div`
  width: 50%;
  padding: 0 30px 0 0;
`

const LeftSide = styled.div`
  width: 50%;
  padding: 0 5vw 0 30px;
`

const AboutUs = styled.h2`
  font-size: max(2.9vw, 20px);
  margin-bottom: 25px;
`

const StyledInput = styled.input`
  border-radius: 5px;
  width:100%;
  height:100%;
  border:none;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  padding-right: max(9.7vw, 135px);
  padding-left:max(1.4vw, 20px);
  border: 1px solid #e3e3e3;
  font-size:max(0.97vw, 20px);
`

const InputWrapper = styled.div`
  height:60px;
  width:100%;
  position:relative;
`

const InputSubmitButton = styled.div`
  background-color: ${({ theme }) => theme.colors.highlight};;
  border-radius: 5px;
  position: absolute;
  width: max(9.7vw,135px);
  outline: none;
  border: none;
  height: 54px;
  top: 3px;
  right: 3px;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-size:max(0.97vw, 20px);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`