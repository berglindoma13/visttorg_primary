import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { saveState } from '../../browser-storage'
import type { RootState } from '../../store'

// Define a type for the slice state
interface FavoriteState {
  products: Array<string>
}

// Define the initial state using that type
const initialState: FavoriteState = {
  products : []
}

export const favoriteSlice = createSlice({
  name: 'favorites',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addToFavorites: (state, action: PayloadAction<string>) => {
      state.products = [...state.products, action.payload]
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.products.forEach((productId, index) => {
        if (productId === action.payload) {
          state.products.splice(index, 1);
        }
      })
    },
  },
})

export const { addToFavorites, removeFromFavorites } = favoriteSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getFavorites = (state: RootState) => state.favorites.products

export default favoriteSlice.reducer