import React from 'react'
import styled from 'styled-components'
import { MainButtonText, StyledMainButton } from './MainButton'
import CloseIcon from '../Svg/Close'

interface FilterItemProps {
  text: string
  onClick: () => void
  active: boolean
  className?: string
}

export const FilterItem = ({ text, onClick, active, className }: FilterItemProps) => {
  return (
    <ModifiedMainButton onClick={onClick} className={[active ? 'active': '', className]}>
      <ModifiedMainButtonText>{text}</ModifiedMainButtonText>
      {active && <StyledCloseIcon fill='#fff' width='10px' height='10px'/>}
    </ModifiedMainButton>
  )
}

const ModifiedMainButtonText = styled(MainButtonText)`
  color: ${({ theme }) => theme.colors.green};
`

const StyledCloseIcon = styled(CloseIcon)`
  margin-left:13px;
`

const ModifiedMainButton = styled(StyledMainButton)`
  display:flex;
  flex-direction:row;
  align-items:center;
  height: 40px;
  margin-bottom:15px;
  margin-right:15px;

  &:hover{
    border: 1px solid ${({ theme }) => theme.colors.green};
  }

  &.active{
    background-color: ${({ theme }) => theme.colors.green};
    border: 1px solid ${({ theme }) => theme.colors.green};

    ${ModifiedMainButtonText}{
      color: #fff;
    }
  } 
`

