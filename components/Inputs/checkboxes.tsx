import React, { ChangeEvent, FormEvent, useState } from 'react'
import styled from 'styled-components'

interface CheckboxProps {
  keyer : string
  value : string
}

interface CheckboxComponentProps extends CheckboxProps {
  handleChange: (event : ChangeEvent<HTMLInputElement>) => void
}

interface CheckboxesProps {
  options : Array<CheckboxProps>
  title : string
  setActiveOptions: any
  activeOptions : Array<any>
  clearActiveOptions?: () => void
}

const Checkbox = ({ keyer, value, handleChange} : CheckboxComponentProps) => {
  return(
    <StyledLabel>
      <StyledInput type="checkbox" value={value} onChange={event => handleChange(event)}/>
      {keyer}
    </StyledLabel>
  )
}

const Checkboxes = ({ options, title, setActiveOptions, activeOptions, clearActiveOptions} : CheckboxesProps) => {

  const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
    
    if(event.target.checked){
      setActiveOptions([...activeOptions, event.target.value])    
    }else{
      const index = activeOptions.indexOf(event.target.value);
      if (index > -1) {
        activeOptions.splice(index, 1);
        setActiveOptions([...activeOptions])
      }
    }

  }

  return (
    <Container>
      <CheckboxListTitle>{title}</CheckboxListTitle>
      <ChecboxList>
        {options.map(option => {
          return(
            <Checkbox keyer={option.keyer} key={option.keyer} value={option.value} handleChange={(event) => handleChange(event)}/>
          )
        })}
      </ChecboxList>
    </Container>
  )
}

export default Checkboxes

const ChecboxList = styled.div`
  display:flex;
  flex-direction:column;
`

const Container = styled.div`

`

const CheckboxListTitle = styled.span`
  font-size: max(0.9vw,14px);
  color: #e3e3e3;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  display:block;
  margin-bottom:5px;
  font-weight:bold;
  margin-top:20px;
`

const StyledLabel = styled.label`
  margin: 5px 0;
  font-size:max(1.1vw, 16px);
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  color:#fff;
`

const StyledInput = styled.input`
  margin-right: 15px;
`