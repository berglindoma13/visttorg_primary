import React from 'react'
import styled from 'styled-components'
import { Heart } from '../Svg'

interface FavoritesButtonProps {
  onClick: () => void
  status: 'enabled' | 'disabled' 
  className: any
}

export const FavoritesButton = ({ onClick, status, className }: FavoritesButtonProps) => {
  return (
    <StyledFavoritesButton onClick={onClick} className={className}>
      {status === 'disabled'  && <Heart variant='outline' id='heartbutton'/>}
      {status === 'enabled'  && <Heart variant='fill' id='heartbutton'/>}
    </StyledFavoritesButton>
  )
}

const StyledFavoritesButton = styled.button`
  height: 18px;
  width: 21px;
  border:none;
  outline:none;
  cursor:pointer;
  padding:0;
  background-color:transparent;
`

