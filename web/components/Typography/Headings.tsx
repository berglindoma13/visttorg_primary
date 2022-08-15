import styled, { css } from 'styled-components'
import { mediaMax } from '../../constants/breakpoints'

export const H1 = css`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: normal;
  font-size: 64px;
  line-height: 104%;
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.colors.black};
  
  @media ${mediaMax.tablet}{
    font-size: 36px;
  }
`

export const H2 = css`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 48px;
  line-height: 104%;
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.colors.black};

  @media ${mediaMax.tablet}{
    font-size: 28px;
  }
`
export const H3 = css`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 36px;
  line-height: 104%;
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.colors.black};

  @media ${mediaMax.tablet}{
    font-size: 24px;
  }
`
export const H4 = css`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 24px;
  line-height: 110%;
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.colors.black};

  @media ${mediaMax.tablet}{
    font-size: 22px;
  }
`
export const H5 = css`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: normal;
  font-size: 16px;
  line-height: 104%;
  letter-spacing: 0.005em;
  color: ${({ theme }) => theme.colors.black};

  @media ${mediaMax.tablet}{
    font-size: 16px;
  }
`
export const H6 = css`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: 600;
  font-size: 14px;
  line-height: 104%;
  letter-spacing: 0.005em;
  color: ${({ theme }) => theme.colors.black};
`

export const Heading1Large = styled.h1`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: normal;
  font-size: 92px;
  line-height: 104%;
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.colors.black};

  @media ${mediaMax.tablet}{
    font-size: 36px;
  }
`

export const Heading1 = styled.h1`
  ${H1}
`

export const Heading2 = styled.h2`
  ${H2}
`

export const Heading3 = styled.h3`
  ${H3}
`

export const Heading4 = styled.h3`
  ${H4}
`

export const Heading5 = styled.h3`
  ${H5}
`

export const Heading6 = styled.h3`
  ${H6}
`