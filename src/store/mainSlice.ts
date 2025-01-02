import { createSlice } from '@reduxjs/toolkit'

const mainStore = createSlice({
  name: 'userStore',
  initialState: {
    user: {},
  },
  reducers:{
    initUser(state,action){
      state.user = action.payload
    }
  }
})

const { initUser } = mainStore.actions

// 获取 reducer 函数
const counterReducer = mainStore.reducer

// 导出
export { initUser }
export default counterReducer