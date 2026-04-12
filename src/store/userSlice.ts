import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SportEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  price: number;
  seatSelected?: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  favoriteTeam: string;
  diet: string;
}

interface UserState {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  registeredEvents: SportEvent[];
}

const initialState: UserState = {
  isAuthenticated: false,
  profile: null,
  registeredEvents: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserProfile>) => {
      state.isAuthenticated = true;
      state.profile = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.profile = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    registerEvent: (state, action: PayloadAction<SportEvent>) => {
      if (!state.registeredEvents.find((e) => e.id === action.payload.id)) {
        state.registeredEvents.push(action.payload);
      }
    },
    unregisterEvent: (state, action: PayloadAction<string>) => {
      state.registeredEvents = state.registeredEvents.filter((e) => e.id !== action.payload);
    }
  },
});

export const { login, logout, updateProfile, registerEvent, unregisterEvent } = userSlice.actions;
export default userSlice.reducer;
