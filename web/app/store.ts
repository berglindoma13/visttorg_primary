import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { loadState } from './browser-storage';
import favoriteReducer from './features/favorites/favoriteSlice'

const reducers = combineReducers({
  favorites: favoriteReducer,
});

const store = configureStore({
  reducer: reducers,
  preloadedState: loadState(),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store