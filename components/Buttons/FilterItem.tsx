import React from 'react'
import styled from 'styled-components'
import { MainButtonText } from './MainButton'
import { Tag } from '../Tag'
import CloseIcon from '../Svg/Close'

interface FilterItemProps {
  text: string
  num?: number 
  onClick: () => void
  active: boolean
  className?: string
}

export const FilterItem = ({ text, num, onClick, active, className }: FilterItemProps) => {
  return (
    <ModifiedMainButton onClick={onClick} className={[active ? 'active': '', className]}>
      {num === undefined ? <ModifiedMainButtonText>{text}</ModifiedMainButtonText> 
        : <ModifiedMainButtonText>{text}</ModifiedMainButtonText> }
      {active && <StyledCloseIcon fill='#fff' width='10px' height='10px'/>}
    </ModifiedMainButton>
  )
}

const ModifiedMainButtonText = styled(MainButtonText)`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 12px;
  line-height: 104%;
  letter-spacing: 0.09em;
  /* font-variant: small-caps; */
  color: #000000;
`

const StyledCloseIcon = styled(CloseIcon)`
  margin-left:13px;
`

const ModifiedMainButton = styled.div`
  background-color: ${({ theme }) => theme.colors.grey_two};
  border-radius: 999px;
  display:flex;
  flex-direction:row;
  justify-content: center;
  align-items: center;
  padding: 7px 15px 8px;
  width: fit-content;
  cursor:pointer;
  height: 40px;
  margin-bottom:15px;
  margin-right:15px;

  &:hover{
    background-color: ${({ theme }) => theme.colors.green};

    ${ModifiedMainButtonText}{
      color:#fff;
    }
  }

  &.active{
    background-color: ${({ theme }) => theme.colors.green};

    ${ModifiedMainButtonText}{
      color: #fff;
    }
  } 
`

