import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MatchEvent {
  id: string;
  type: 'score' | 'six' | 'four' | 'wicket' | 'break' | 'rush';
  text: string;
  timestamp: number;
}

export interface LiveMatchState {
  sport: string;
  teams: [string, string];
  currentScore: string;
  currentOver: string;
  isBreakTime: boolean;
  isRushTime: boolean;
  events: MatchEvent[];
}

const initialState: LiveMatchState = {
  sport: 'Cricket',
  teams: ['Chennai Super Kings', 'Mumbai Indians'],
  currentScore: 'CSK 142/3',
  currentOver: '14.2',
  isBreakTime: false,
  isRushTime: false,
  events: [],
};

const liveMatchSlice = createSlice({
  name: 'liveMatch',
  initialState,
  reducers: {
    addMatchEvent: (state, action: PayloadAction<MatchEvent>) => {
      state.events.unshift(action.payload);
      // Keep only last 20 events
      if (state.events.length > 20) {
        state.events.pop();
      }
    },
    updateMatchStatus: (state, action: PayloadAction<Partial<LiveMatchState>>) => {
      Object.assign(state, action.payload);
    }
  },
});

export const { addMatchEvent, updateMatchStatus } = liveMatchSlice.actions;
export default liveMatchSlice.reducer;
