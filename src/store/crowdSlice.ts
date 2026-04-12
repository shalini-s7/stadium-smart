import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Zone } from '../types';

interface CrowdState {
  zones: Record<string, Zone>;
  globalDensity: 'clear' | 'moderate' | 'high' | 'critical';
  lastUpdated: number | null;
}

const initialState: CrowdState = {
  zones: {},
  globalDensity: 'clear',
  lastUpdated: null,
};

const crowdSlice = createSlice({
  name: 'crowd',
  initialState,
  reducers: {
    updateZones: (state, action: PayloadAction<Zone[]>) => {
      let totalOccupancy = 0;
      let totalCapacity = 0;

      action.payload.forEach((zone) => {
        state.zones[zone.id] = zone;
        totalOccupancy += zone.currentOccupancy;
        totalCapacity += zone.capacity;
      });

      state.lastUpdated = Date.now();
      
      const avgDensity = totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;
      
      if (avgDensity > 85) state.globalDensity = 'critical';
      else if (avgDensity > 70) state.globalDensity = 'high';
      else if (avgDensity > 45) state.globalDensity = 'moderate';
      else state.globalDensity = 'clear';
    },
    updateSingleZone: (state, action: PayloadAction<Zone>) => {
      state.zones[action.payload.id] = action.payload;
    }
  },
});

export const { updateZones, updateSingleZone } = crowdSlice.actions;
export default crowdSlice.reducer;
