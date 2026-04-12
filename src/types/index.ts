export interface Zone {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  densityPercent: number;
  alertStatus: 'clear' | 'moderate' | 'high' | 'critical';
  aiPrediction: {
    next10min: number;
    next20min: number;
    trend: 'rising' | 'stable' | 'falling';
    confidence: number;
    trafficReason?: string;
  };
  liveMatch?: {
    sport: string;
    teams: string;
    score: string;
    keyPlayers: string[];
  };
  updatedAt: number;
}
