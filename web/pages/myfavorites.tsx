import { GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react'
import { prismaInstance } from '../lib/prisma'
import { ProductProps } from '../types/products';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { addToFavorites, getFavorites } from '../app/features/favorites/favoriteSlice'
import superjson from 'superjson'

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

  const productListString = superjson.stringify(productList)

  return { props: { productListString }}
}

interface MyFavoritesProps {
  productListString: string
}

const MyFavorites = ({ productListString }: MyFavoritesProps) => {
  const productList: Array<ProductProps> = superjson.parse(productListString)

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