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
}

const Checkbox = ({ keyer, value, handleChange} : CheckboxComponentProps) => {
  return(
    <StyledLabel>
      <StyledInput type="checkbox" value={keyer} onChange={event => handleChange(event)}/>
      {value}
    </StyledLabel>
  )
}

const Checkboxes = ({ options, title, setActiveOptions, activeOptions} : CheckboxesProps) => {

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
  font-size:24px;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  display:block;
  margin-bottom:5px;
  margin-top:20px;
`

const StyledLabel = styled.label`
  margin: 5px 0;
  font-size:20px;
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
`

const StyledInput = styled.input`
  margin-right: 15px;
`