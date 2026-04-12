import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  hasBooked: boolean;
  bookedSeats: string[];
}

const initialState: BookingState = {
  hasBooked: false,
  bookedSeats: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    bookSeats: (state, action: PayloadAction<string[]>) => {
      // Append if they book more, or just overwrite for the demo
      state.bookedSeats = Array.from(new Set([...state.bookedSeats, ...action.payload]));
      state.hasBooked = true;
    },
    clearBookings: (state) => {
      state.bookedSeats = [];
      state.hasBooked = false;
    }
  },
});

export const { bookSeats, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
