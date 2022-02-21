import React from 'react'
import styled from 'styled-components'

interface MainButtonProps {
  text: string
  onClick?: () => void
  active?: boolean
  className?: string
  isLink?: boolean
  href?: string
}

export const MainButton = ({ text, onClick, active, className, isLink, href }: MainButtonProps) => {
  
  if(isLink){
    return(
      <a href={href} target="_blank">
        <StyledMainLink className={[active ? 'active': '', className]}>
          <MainButtonText>{text}</MainButtonText>
        </StyledMainLink>
      </a>
    )
  }
  
  return (
    <StyledMainButton onClick={onClick} className={[active ? 'active': '', className]}>
      <MainButtonText>{text}</MainButtonText>
    </StyledMainButton>
  )
}

export const MainButtonText = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilSecondary};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 104%;
  letter-spacing: 0.09em;
  font-variant: small-caps;
  display:block;
  color: ${({ theme }) => theme.colors.black};
`

export const StyledMainLink = styled.div`
  padding: 8px 18px 10px 18px;
  height: 33px;
  background: #FFFFFF;
  box-shadow: 0px 4px 26px 10px rgba(154, 154, 154, 0.1);
  border-radius: 1284.43px;
  border:none;
  outline:none;
  width: fit-content;
  min-width: fit-content;
  cursor:pointer;
  border: 1px solid #fff;

  &:hover{
    ${MainButtonText}{
      color: ${({ theme }) => theme.colors.green};
    }
  }

  &.active{
    background-color: ${({ theme }) => theme.colors.green};
    border: 1px solid ${({ theme }) => theme.colors.green};

    ${MainButtonText}{
      color: #fff;
    }
  }

  &.disabled{
    cursor: not-allowed;
    ${MainButtonText}{
      color: ${({ theme }) => theme.colors.grey_four};
    }

    &:hover{
      ${MainButtonText}{
        color: ${({ theme }) => theme.colors.grey_four};
      }
    }
  }
`

export const StyledMainButton = styled.button`
  padding: 8px 18px 10px;
  height: 33px;
  background: #FFFFFF;
  box-shadow: 0px 4px 26px 10px rgba(154, 154, 154, 0.1);
  border-radius: 1284.43px;
  border:none;
  outline:none;
  width: fit-content;
  min-width: fit-content;
  cursor:pointer;
  border: 1px solid #fff;

  &:hover{
    ${MainButtonText}{
      color: ${({ theme }) => theme.colors.green};
    }
  }

  &.active{
    background-color: ${({ theme }) => theme.colors.green};
    border: 1px solid ${({ theme }) => theme.colors.green};

    ${MainButtonText}{
      color: #fff;
    }
  }

  &.disabled{
    cursor: not-allowed;
    ${MainButtonText}{
      color: ${({ theme }) => theme.colors.grey_four};
    }

    &:hover{
      ${MainButtonText}{
        color: ${({ theme }) => theme.colors.grey_four};
      }
    }
  }
`

