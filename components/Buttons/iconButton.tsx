import React from 'react'
import styled from 'styled-components'

interface IconButtonProps {
  icon: React.ReactNode
  onClick: () => void
}

export const IconButton = ({ icon, onClick }: IconButtonProps) => {
  return(
    <Button onClick={onClick}>
      {icon}
    </Button>
  )
} 

const Button = styled.button`
  padding: 5px 13px 5px 13px;
  height: 35px;
  background: #FFFFFF;
  box-shadow: 0px 4px 26px 10px rgba(154,154,154,0.1);
  border-radius: 20px;
  border: none;
  outline: none;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  min-width: -webkit-fit-content;
  min-width: -moz-fit-content;
  min-width: fit-content;
  cursor: pointer;
  border: 1px solid #fff;
  font-size: 20px;
`