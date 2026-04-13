import { configureStore } from '@reduxjs/toolkit';
import crowdReducer from './crowdSlice';
import userReducer from './userSlice';
import liveMatchReducer from './liveMatchSlice';
import cartReducer from './cartSlice';
import bookingReducer from './bookingSlice';
import networkReducer from './networkSlice';

export const store = configureStore({
  reducer: {
    crowd: crowdReducer,
    user: userReducer,
    liveMatch: liveMatchReducer,
    cart: cartReducer,
    booking: bookingReducer,
    network: networkReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
