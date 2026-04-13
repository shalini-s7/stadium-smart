import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface NetworkPost {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  timestamp: number;
  likes: number;
  comments: number;
  eventCard?: {
    title: string;
    date: string;
  };
}

export interface LegendPerson {
  id: string;
  name: string;
  avatar: string;
  role: string; // e.g., "Legendary Batsman", "Head Coach"
  verified: boolean;
  tips: string[];
}

interface NetworkState {
  posts: NetworkPost[];
  legends: LegendPerson[];
}

const initialState: NetworkState = {
  posts: [
    {
      id: 'p1',
      userName: 'Cricket Fanatic',
      userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Fanatic',
      content: 'Just reached the stadium! The atmosphere is electric. Checking in from Zone B. 🏟️🔥',
      image: 'https://images.unsplash.com/photo-1540747913346-19e3adbb17c1?auto=format&fit=crop&q=80&w=800',
      timestamp: Date.now() - 3600000,
      likes: 24,
      comments: 5,
      eventCard: { title: 'IND vs AUS Finals', date: 'Oct 20, 2:00 PM' }
    },
    {
      id: 'p2',
      userName: 'Sarah Jenkins',
      userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah',
      content: 'The new smart navigation saved me 15 minutes today! Highly recommend using the Heatmap before heading to Gate A.',
      timestamp: Date.now() - 7200000,
      likes: 42,
      comments: 12
    }
  ],
  legends: [
    {
      id: 'l1',
      name: 'Virat K.',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Virat',
      role: 'Legendary Batsman',
      verified: true,
      tips: ['Consistency is key in the nets.', 'Mental focus during the death overs is what separates winners.']
    },
    {
      id: 'l2',
      name: 'Coach Rick',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rick',
      role: 'Strategy Head',
      verified: true,
      tips: ['Always watch the ball till the very last millisecond.', 'Fielding wins you matches as much as batting does.']
    },
    {
      id: 'l3',
      name: 'Mithali R.',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Mithali',
      role: 'Cricket Icon',
      verified: true,
      tips: ['Balance your stance before the trigger movement.', 'Respect the conditions on Day 1.']
    }
  ]
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<NetworkPost>) => {
      state.posts.unshift(action.payload);
    },
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) post.likes += 1;
    }
  }
});

export const { addPost, likePost } = networkSlice.actions;
export default networkSlice.reducer;
