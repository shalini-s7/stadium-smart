import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateZones } from '../store/crowdSlice';
import type { Zone } from '../types';

const MOCK_ZONES: Zone[] = [
  {
    id: 'zone-a',
    name: 'Gate A',
    capacity: 1000,
    currentOccupancy: 200,
    densityPercent: 20,
    alertStatus: 'clear',
          aiPrediction: { next10min: 300, next20min: 400, trend: 'rising', confidence: 0.85, trafficReason: 'Security scanners at Gate A are running slowly, creating a bottleneck.' },
    updatedAt: Date.now(),
  },
  {
    id: 'zone-b',
    name: 'Food Court North',
    capacity: 1500,
    currentOccupancy: 1200,
    densityPercent: 80,
    alertStatus: 'high',
    aiPrediction: { next10min: 1300, next20min: 1100, trend: 'stable', confidence: 0.9 },
    liveMatch: { sport: 'Basketball', teams: 'Lakers vs Heat', score: 'Lakers 102 - 98 Heat', keyPlayers: ['LeBron James (28pts)', 'Jimmy Butler (25pts)'] },
    updatedAt: Date.now(),
  },
  {
    id: 'zone-c',
    name: 'Merchandise East',
    capacity: 500,
    currentOccupancy: 150,
    densityPercent: 30,
    alertStatus: 'clear',
    aiPrediction: { next10min: 160, next20min: 200, trend: 'rising', confidence: 0.75 },
    updatedAt: Date.now(),
  },
  {
    id: 'zone-d',
    name: 'Gate C Restrooms',
    capacity: 300,
    currentOccupancy: 275,
    densityPercent: 91,
    alertStatus: 'critical',
    aiPrediction: { next10min: 250, next20min: 150, trend: 'falling', confidence: 0.8 },
    updatedAt: Date.now(),
  }
];

export function useMockFirestore() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial load
    dispatch(updateZones(MOCK_ZONES));

    // Simulate real-time updates every 3 seconds
    const interval = setInterval(() => {
      const updatedZones = MOCK_ZONES.map(zone => {
        // Random walk for occupancy +/- 5%
        const change = Math.floor((Math.random() - 0.5) * zone.capacity * 0.1);
        const newOccupancy = Math.max(0, Math.min(zone.capacity, zone.currentOccupancy + change));
        const density = (newOccupancy / zone.capacity) * 100;
        
        let status: Zone['alertStatus'] = 'clear';
        if (density >= 90) status = 'critical';
        else if (density >= 70) status = 'high';
        else if (density >= 45) status = 'moderate';
        
        // Randomly adjust predictions
        const currentZone = { ...zone };
        currentZone.currentOccupancy = Math.floor(newOccupancy);
        currentZone.densityPercent = Math.floor(density);
        currentZone.alertStatus = status;
        currentZone.updatedAt = Date.now();
        
        return currentZone;
      });
      
      dispatch(updateZones(updatedZones));
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);
}
