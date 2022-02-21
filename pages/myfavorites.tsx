import { GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react'
import { prismaInstance } from '../lib/prisma'
import { ProductProps } from '../types/products';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { addToFavorites, getFavorites } from '../app/features/favorites/favoriteSlice'

export const getStaticProps: GetStaticProps = async () => {

  const productList = await prismaInstance.product.findMany({
    include: {
      sellingcompany: true,
      categories : true,
      certificates: {
        include: {
          certificate : true
        }
      }
    },
  });


  return { props: { productList }}
}

interface MyFavoritesProps {
  productList: ProductProps[]
}

const MyFavorites = ({ productList }: MyFavoritesProps) => {

  const myProducts = useAppSelector((state) => state.favorites.products)
  const dispatch = useAppDispatch()

  const [loading,setLoading] = useState(true)
  useEffect(() => {
    const myFavs = window.localStorage.getItem('myFavorites')

    console.log('myFavs', myFavs)

    //Convert string to array

  }, [])

  return(
    <div>
      <button onClick={() => dispatch(addToFavorites('123'))}></button>
      {myProducts && (
        myProducts.map(product => {
          return (
            <span>{product}</span>
          )
        })
      )}
    </div>
  )
}

export default MyFavorites