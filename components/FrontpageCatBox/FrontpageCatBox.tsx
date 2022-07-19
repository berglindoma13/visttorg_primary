import styled from 'styled-components'
import Sink from '../../public/SinkIcon.svg'
import PaperPen from '../../public/PaperPenIcon.svg'
import PaintBucket from '../../public/PaintBucketIcon.svg'
import { theme } from '../../styles/theme'
import Link from 'next/link'
import Image from 'next/image'
import { mediaMax } from '../../constants/breakpoints'

interface FrontpageCatBoxProps {
  title?: string
  iconImage: 'Sink' | 'PaperPen' | 'PaintBucket'
  url: string
  color: 'orange' | 'green' | 'purple'
}

export const FrontpageCatBox = ({ title, iconImage, url, color }: FrontpageCatBoxProps) => {
  
  const getThemeColor = (color: string) => {
    switch(color){
      case 'orange':
        return theme.colors.orange
      case 'purple':
        return theme.colors.purple
      case 'green':
        return theme.colors.green
    }
  }

  const getImage = (image: string) => {
    switch(image){
      case 'Sink':
        return Sink
      case 'PaperPen':
        return PaperPen
      case 'PaintBucket':
        return PaintBucket
    }
  }

  return (
    <Link href={url}>
      <BoxWrapper
        color={getThemeColor(color)}
      >
        <BoxTitle>{title}</BoxTitle>
        <ImageWrapper>
          <Image 
            src={getImage(iconImage)} 
            alt='Icon image' 
            layout='fill'
            objectFit='contain'
          />
        </ImageWrapper>
      </BoxWrapper>
    </Link>
  )
}

interface BoxWrapperProps{
  color: string
}
const BoxWrapper = styled.div<BoxWrapperProps>`
  max-width: 300px;
  width:33.3%;
  height: 270px;
  box-shadow: 0px 4px 26px 10px rgba(154, 154, 154, 0.1);
  border-radius: 16px;
  background-color: ${({ color }) => color};
  padding: 35px 40px 25px 40px;
  display:flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media ${mediaMax.tablet}{
    width: 270px;
    height: 80px;
    flex-direction: row-reverse;
    padding: 15px 20px 10px 10px;
    margin-bottom: 45px;
  }
`

const BoxTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilSecondary};
  font-weight: 600;
  font-size: 24px;
  line-height: 110%;
  text-align: center;
  letter-spacing: -0.025em;
  color: #000000;
  width: 100%;
  margin-bottom:10px;


  @media ${mediaMax.tablet}{
    margin-bottom:0;
    text-align: left;
    margin-left: 10px;
  }
`

const ImageWrapper = styled.div`
  max-height:100%;
  height: 100%;
  position:relative;
  width: 70%;
  @media ${mediaMax.tablet}{
    width: 25%;
    height:auto;
  }
`