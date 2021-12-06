import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import Checkbox from '@mui/material/Checkbox'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import FormControlLabel from '@mui/material/FormControlLabel';
import { theme } from '../../styles/theme'
interface CheckboxProps {
  keyer : string
  value : string
}

interface CheckboxComponentProps extends CheckboxProps {
  handleChange: (event : ChangeEvent<HTMLInputElement>) => void
}

interface Counter {
  name: string
  count: number
}

interface CheckboxesProps {
  options : Array<CheckboxProps>
  title : string
  setActiveOptions: any
  activeOptions : Array<any>
  clearActiveOptions?: () => void
  counters?: Array<Counter>
}

const SingleCheckbox = ({ keyer, value, handleChange} : CheckboxComponentProps) => {
  
  const CheckboxTheme = createTheme({
    palette: {
      primary: { main: '#3C6F72', dark: '#2a4d4f', light: '#638b8e'},
      text: {
        primary: '#000',
        secondary: '#000'
      }
    }
  });
  return(
    <ThemeProvider theme={CheckboxTheme}>
      <FormControlLabel control={<Checkbox value={value} onChange={event => handleChange(event)} color="primary" />} label={keyer} />
    </ThemeProvider>
  )
}

const Checkboxes = ({ options, title, setActiveOptions, activeOptions, clearActiveOptions, counters } : CheckboxesProps) => {
  const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
    
    if(event.target.checked){
      setActiveOptions([...activeOptions, event.target.value])
    }else{
      const index = activeOptions.indexOf(event.target.value)
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
          
          const filteredCounter = counters.filter(c => c.name === option.keyer)
          const counter = filteredCounter.length > 0 ? filteredCounter[0].count : 0
          return(
            <SingleCheckbox keyer={`${option.keyer} (${counter})`} key={option.keyer} value={option.value} handleChange={(event) => handleChange(event)}/>
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
  color: #565656;
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
  color:#000;
`

// const StyledInput = styled.input`
//   margin-right: 15px;
// `