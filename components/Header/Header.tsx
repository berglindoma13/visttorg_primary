import React, { useState } from 'react'
import styled from 'styled-components'
import VistbokLogo from '../Svg/VistbokLogo'
import Link from 'next/link'
import { TextInput } from '../Inputs/TextInput/TextInput'
import MagnifyingGlass from '../Svg/MagnifyingGlass'
import { mediaMax } from '../../constants/breakpoints'
import { useRouter } from 'next/router'

interface HeaderProps{
  showSearch: boolean
  className: string
}

export const Header = ({ showSearch, className }: HeaderProps) => {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')

  const Submit = () => {
    router.push(`/?query=${search}#search`)
  }

  return(
    <HeaderWrapper className={className}>
      <Link href="/" passHref>
        <a>
          <VistbokLogo style={{cursor:'pointer'}} width="150px"/>
        </a>
      </Link>
      {showSearch ? (
        <>
          {/* DESKTOP */}     
          <TextInputWrapper>
            <TextInput placeholder='Leita eftir nafni vöru' onSubmit={Submit} onChange={(e) => setSearch(e.target.value)} inputIcon={<MagnifyingGlass />}/>
          </TextInputWrapper>
          {/* MOBILE */}
          <Link href='/#search' passHref>
            <MobileSearchButton>
              <MagnifyingGlass />
            </MobileSearchButton>
          </Link>
        </>
      ) : ( 
        <SidebarWrapper>
          <TopbarWrapper>
            <Link href='/umokkur'>
              <NavItem>Um okkur</NavItem>
            </Link>
          </TopbarWrapper>
          <TopbarWrapper>
            <Link href='/myfavorites'>
              <NavItem>Þínar vörur</NavItem>
            </Link> 
          </TopbarWrapper>
        </SidebarWrapper>
      )}
    </HeaderWrapper>
  )
}

const MobileSearchButton = styled.a`
  display:none;
  cursor: pointer;

  @media ${mediaMax.mobileL}{
    display:block;
  }
`

const TextInputWrapper = styled.div`
  width: 350px;

  @media ${mediaMax.mobileL}{
    display:none;
  }
`

const HeaderWrapper = styled.div`
  height:92px;
  width:100%;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 88px;

  @media ${mediaMax.tablet}{
    padding: 0 35px;
  }
`

const NavItem = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 16px;
  line-height: 104%;
  letter-spacing: 0.09em;
  /* font-variant: small-caps; */
  color: #000000;
  cursor: pointer;
  padding-bottom: 8px;

  &:hover{
    color: ${({ theme }) => theme.colors.green};
  }
`

const SidebarWrapper = styled.span`
  display:flex;
  flex-direction: row;
`

const TopbarWrapper = styled.span`
  padding-left: 20px;
`