import styled from 'styled-components'

export const UIBig = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 16px;
  line-height: 104%;
  letter-spacing: 0.09em;
  /* font-variant: small-caps; */
  color: #000000;
  display:block;
`

export const UIMedium = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 14px;
  line-height: 104%;
  letter-spacing: 0.09em;
  /* font-variant: small-caps; */
  color: #000000;
  display:block;
`

export const UISmall = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 12px;
  line-height: 104%;
  letter-spacing: 0.09em;
  /* font-variant: small-caps; */
  color: #000000;
  display:block;
`