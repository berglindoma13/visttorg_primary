import styled from 'styled-components'
import MagnifyingGlass from '../../Svg/MagnifyingGlass'

interface TextInputProps {
  placeholder: string
  onSubmit: () => void
  className?: string
  onChange: (e) => void
  value?: string
}

export const TextInput = ({ placeholder, onSubmit, className, onChange, value }: TextInputProps) => {
  
  const _onSubmit = (e) => {
    if (e.which === 13) {
      onSubmit()
    }
  }
  
  return(
    <InputWrapper className={className}>
      <StyledMagnifyingGlass />
      <StyledTextInput placeholder={placeholder} onKeyPress={_onSubmit} value={value} onChange={onChange}/>
    </InputWrapper>
  )
}

const StyledMagnifyingGlass = styled(MagnifyingGlass)`
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
    ${StyledMagnifyingGlass}{
      fill: ${({ theme }) => theme.colors.green};
    }
  }
  
`


const StyledTextInput = styled.input`
  height: 40px;
  width:100%;
  padding-left:50px;
  position:relative;
  background: #FAFAFA;
  box-shadow: 0px 4px 26px 10px rgba(154, 154, 154, 0.1);
  border-radius: 999px;
  border:none;
  outline:none;
  font-family: ${({ theme }) => theme.fonts.fontFamilSecondary};
  font-weight: 600;
  font-size: 14px;
  line-height: 104%;
  letter-spacing: 0.09em;
  color: ${({ theme }) => theme.colors.grey_five};

  &::placeholder{
    font-family: ${({ theme }) => theme.fonts.fontFamilSecondary};
    font-weight: 600;
    font-size: 14px;
    line-height: 104%;
    letter-spacing: 0.09em;
    font-variant: small-caps;
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