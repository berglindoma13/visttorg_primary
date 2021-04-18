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
    <label>
      <input type="checkbox" value={keyer} onChange={event => handleChange(event)}/>
      {value}
    </label>
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
  font-size:18px;
  font-weight:bold;
`