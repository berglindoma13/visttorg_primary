import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { MainButton, FavoritesButton } from '../Buttons'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addToFavorites, getFavorites, removeFromFavorites } from '../../app/features/favorites/favoriteSlice'
import { mediaMax } from '../../constants/breakpoints'
import Link from 'next/link'
import { useRouter } from 'next/router'
//Product has 3 states -> Desktop, Mobile, Hover

interface SingleProductProps {
  productId: string
  title: string,
  shortdescription: string,
  sellingcompany: string,
  productimageurl: string
  className?: string
  productCompany: number
}

export const Product = ({ 
  productId,
  title, 
  shortdescription, 
  sellingcompany,
  productimageurl,
  className,
  productCompany
}: SingleProductProps) => {

  const myProducts = useAppSelector((state) => getFavorites(state))
  const dispatch = useAppDispatch()

  const router = useRouter()
  
  return(
    <Link href={`/product/${productId}?c=${productCompany}`}>
      <StyledProduct className={className}>
        <StyledFavoritesButton 
          onClick={(e) => {
            if(e.target.id === 'heartbutton') {
              e.preventDefault()
            }
            if(myProducts.includes(productId)){
              dispatch(removeFromFavorites(productId))
            }else{
              dispatch(addToFavorites(productId))
            }
          }}
          status={myProducts.includes(productId) ? 'enabled' : 'disabled'} />
        {productimageurl && 
        <ProductImage>
          <Image
            src={productimageurl}
            alt={`Product image for ${title}`}
            layout='fill'
            objectFit='contain'
          />
        </ProductImage>}
        <ProductDetails>
          <ProductCompany>{sellingcompany}</ProductCompany>
          <ProductTitle>{title}</ProductTitle>
          <ProductAbstract>{shortdescription && shortdescription.replace(/<[^>]+>/g, '')}</ProductAbstract>
          <StyledMainButton text='Skoða' onClick={() =>  router.push(`/product/${productId}?c=${productCompany}`)}/>
        </ProductDetails>
      </StyledProduct>
    </Link>
  )
}

const StyledMainButton = styled(MainButton)`
  position: absolute;
  bottom: 10px;
  left: 45px;
`

const StyledProduct = styled.div`
  min-width: 300px;
  width: 23%;
  height: auto;
  background: #FFFFFF;
  box-shadow: 0px 4px 26px 10px rgba(154, 154, 154, 0.1);
  border-radius: 16px;
  display:flex;
  flex-direction:column;
  padding: 12px;
  position:relative;
  transition: box-shadow 0.2s ease-in;
  cursor: pointer;
  padding-bottom:40px;

  &:hover{
    box-shadow: 0px 4px 44px 4px rgba(132, 132, 132, 0.55);
    transition: box-shadow 0.2s ease-in;
  }

  @media ${mediaMax.mobileL}{
    min-width: 100%;
  }
`

const StyledFavoritesButton = styled(FavoritesButton)`
  position:absolute;
  top:22px;
  right:22px;
  z-index:10;
`

const ProductImage = styled.div`
  width:100%;
  height:235px;
  border-radius: 8px 8px 0px 0px;
  position:relative;
`

const ProductDetails = styled.div`
  padding: 0 34px;
  display:flex;
  flex-direction:column;
  justify-content: space-between;
`

const ProductCompany = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: bold;
  font-size: 14px;
  line-height: 104%;
  letter-spacing: 0.005em;
  color: #000000;
  margin-bottom:25px;
  margin-top:20px;
`
const ProductTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilySecondary};
  font-weight: 600;
  font-size: 36px;
  line-height: 104%;
  letter-spacing: -0.025em;
  color: #000000;
  margin-bottom:25px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`
const ProductAbstract = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamilyPrimary};
  font-weight: normal;
  font-size: 16px;
  line-height: 125%;
  letter-spacing: 0.005em;
  color: #000000;
  margin-bottom:25px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`