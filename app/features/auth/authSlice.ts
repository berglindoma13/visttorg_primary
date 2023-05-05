import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

// Define a type for the slice state
interface AuthState {
  user?: { token: string }
}

// Define the initial state using that type
const initialState: AuthState = {
  user: undefined
}

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    login: (state, action: PayloadAction<string>) => {
      state.user = { ...state, token : action.payload }
    },
    logout: (state) => {
      state.user = undefined
    }
  },
})

export const { login, logout } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getAuth = (state: RootState) => state.auth.user

export default authSlice.reducer