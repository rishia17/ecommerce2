import {configureStore} from '@reduxjs/toolkit'
import userLoginSlice from './slices/userLoginSlice' 
export const reduxStore=configureStore({
    reducer:{
        userLogin:userLoginSlice
    }
})