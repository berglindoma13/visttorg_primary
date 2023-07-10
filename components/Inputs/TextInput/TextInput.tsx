import { AnyAaaaRecord } from 'dns'
import styled from 'styled-components'
import MagnifyingGlass from '../../Svg/MagnifyingGlass'
import { forwardRef } from 'react'

interface TextInputProps {
  placeholder: string
  onSubmit?: () => void
  className?: string
  onChange: (e) => void
  value?: string
  inputIcon?: React.ReactNode
  ref: any
  type?: string
}

export const TextInput = forwardRef(({ placeholder, onSubmit, className, onChange, value, inputIcon, type }: TextInputProps, ref) => {
  
  const _onSubmit = (e) => {
    if (e.which === 13) {
      // onSubmit()
    }
  }
  
  return(
    <InputWrapper className={className}>
      {inputIcon && <StyledIcon>{inputIcon}</StyledIcon>}
      <StyledTextInput type={!!type ? type : "text" } placeholder={placeholder} onKeyPress={_onSubmit} value={value} onChange={onChange} withIcon={!!inputIcon}/>
    </InputWrapper>
  )
})

const StyledIcon = styled.div`
  position:absolute;
  left:18px;
  top:11px;
  z-index:2;
`

const InputWrapper = styled.div`
  height: 40px;
  width:100%;
  position:relative;

  &:hover{
    ${StyledIcon}{
      fill: ${({ theme }) => theme.colors.green};
    }
  } 
`

interface inputStyleProps{
  withIcon: boolean
}

const StyledTextInput = styled.input<inputStyleProps>`
  height: 40px;
  width:100%;
  padding-left: ${({ withIcon }) => withIcon ? '50px' : '20px'};
  position:relative;
  background: #FAFAFA;
  box-shadow: 0px 4px 26px 10px rgba(154, 154, 154, 0.1);
  border-radius: 999px;
  border:none;
  outline:none;
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 14px;
  line-height: 104%;
  letter-spacing: 0.09em;
  color: ${({ theme }) => theme.colors.grey_five};

  &::placeholder{
    font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
    font-weight: 600;
    font-size: 14px;
    line-height: 104%;
    letter-spacing: 0.09em;
    /* font-variant: small-caps; */
    color: ${({ theme }) => theme.colors.grey_five};
  }

  &:hover{
    &::placeholder{
      color: ${({ theme }) => theme.colors.green};
    }
  }

  &:focus{
    border: 1px solid ${({ theme }) => theme.colors.green};

    &::placeholder{
      color: #FAFAFA;
    }
  }
`