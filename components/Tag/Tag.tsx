import styled from 'styled-components'

interface TagProps{
  title: string
  style?: any
}
export const Tag = ({ title, style }: TagProps) => {
  return(
    <CustomTag style={style}>{title}</CustomTag>
  ) 
}

const CustomTag = styled.div`
  background-color: ${({ theme }) => theme.colors.grey_two};
  border-radius: 999px;
  display:flex;
  flex-direction:row;
  justify-content: center;
  align-items: center;
  padding: 7px 15px 8px;
  width: fit-content;

  font-family: ${({ theme }) => theme.fonts.fontFamilSecondary};
  font-weight: 600;
  font-size: 12px;
  line-height: 104%;
  letter-spacing: 0.09em;
  font-variant: small-caps;
  color: #000000;
`