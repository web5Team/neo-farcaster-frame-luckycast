// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from "next-redux-wrapper";
import mainSlice from './mainSlice';

const makeStore = () => configureStore({
  reducer: {
    counter: mainSlice,
  },
});
export type AppStore = ReturnType<typeof makeStore>;
export const wrapper = createWrapper<AppStore>(makeStore);