import React from 'react'
import styled from 'styled-components'
import { MainButtonText, StyledMainButton } from './MainButton'
import FilterIcon from '../Svg/FilterIcon'
import { theme } from '../../styles/theme'

interface MainButtonProps {
  text: string
  numberString?: string
  onClick: () => void
  active: boolean
  className?: any
}

export const FilterButton = ({ text, numberString, onClick, active, className }: MainButtonProps) => {
  return (
    <ModifiedMainButton onClick={onClick} className={`${active ? 'active': ''} ${className}`}>
      <FilterIcon fill={active ? '#fff' : theme.colors.green}/>
      <ModifiedMainButtonText>{text}</ModifiedMainButtonText>
      <ModifiedMainButtonText>{numberString}</ModifiedMainButtonText>
    </ModifiedMainButton>
  )
}

const ModifiedMainButtonText = styled(MainButtonText)`
  margin-left:13px;
  color: ${({ theme }) => theme.colors.green};
`

const ModifiedMainButton = styled(StyledMainButton)`
  display:flex;
  flex-direction:row;
  align-items:center;
  height: 40px;

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

