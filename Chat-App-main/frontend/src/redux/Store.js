import { configureStore } from '@reduxjs/toolkit'
import userReducer from './UserSlice'
// import { userReducer } from 'react'


export const Store =  configureStore({
  reducer: {
    user: userReducer
  },
})