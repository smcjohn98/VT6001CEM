import { configureStore } from '@reduxjs/toolkit';
import Reducer from './Reducer';

const Store = configureStore({
  reducer: {
    store: Reducer,
  },
});

export default Store;