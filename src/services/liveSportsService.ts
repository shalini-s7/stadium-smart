import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMatchEvent, updateMatchStatus } from '../store/liveMatchSlice';
import type { MatchEvent } from '../store/liveMatchSlice';

const SIMULATION_EVENTS = [
  { type: 'score', text: 'Single taken. Strike rotated.' },
  { type: 'score', text: 'Good length delivery, defended solidly.' },
  {
    type: 'match_event',
    title: 'SIX! Massimo by Dhoni!',
    message: 'He steps out and launches it over long-on. Absolute carnage! They need 14 off 7 balls now.',
    color: 'bg-primary-50 text-primary-600',
  },
  {
    type: 'match_event',
    title: 'WICKET! Clean Bowled!',
    message: 'Bumrah sends the middle stump cartwheeling. Massive shift in momentum.',
    color: 'bg-red-50 text-red-600',
  },
  {
    type: 'facility',
    title: 'Popcorn Stalls Fresh Batches',
    message: 'Sections 12 and 14 just stocked fresh caramel popcorn. Beat the queue now!',
    color: 'bg-orange-50 text-orange-600',
  },
  { type: 'break', text: 'Strategic Time-out. Match will pause for 2.5 minutes.' },
  { type: 'rush', text: 'Over completion. Expect sudden rushes at food stalls.' },
];

export const useLiveSportsSimulator = () => {
  const dispatch = useDispatch();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Generate a new simulated cricket event every 15-30 seconds
    const scheduleNextEvent = () => {
      const waitTime = Math.floor(Math.random() * 15000) + 15000;
      timerRef.current = window.setTimeout(() => {
        // Pick a random event
        const randomAction = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];
        
        const newEvent: MatchEvent = {
          id: Date.now().toString(),
          type: randomAction.type as any,
          text: randomAction.text || `${(randomAction as any).title} - ${(randomAction as any).message}`,
          timestamp: Date.now()
        };

        dispatch(addMatchEvent(newEvent));

        // Update global match stats based on the event
        if (randomAction.type === 'break') {
          dispatch(updateMatchStatus({ isBreakTime: true, isRushTime: true }));
        } else if (randomAction.type === 'rush') {
          dispatch(updateMatchStatus({ isRushTime: true }));
        } else {
          dispatch(updateMatchStatus({ isBreakTime: false, isRushTime: false }));
        }

        // Keep simulating
        scheduleNextEvent();
      }, waitTime);
    };

    scheduleNextEvent();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dispatch]);
};
