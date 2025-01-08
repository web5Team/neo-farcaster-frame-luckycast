// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface StatusState {
  isConnect: boolean
}

const initialState: StatusState = {
  isConnect: false,
}

export const stateSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setConnect: (state, action: PayloadAction<boolean>) => {
      state.isConnect = action.payload
    },
    logout: (state) => {
      state.isConnect = false
    },
  },
})

export const { setConnect, logout } = stateSlice.actions
export default stateSlice.reducer
