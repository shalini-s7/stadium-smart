/**
 * storageService.ts
 * A mock service to simulate "Google-like cloud storage" (Firebase/Supabase style)
 * for persisting user-specific data associated with their Google account.
 */

export interface CloudUserMetadata {
  id: string;
  preferences: {
    lastAppVisited: string;
    favoriteSports: string[];
    isPremium: boolean;
    cloudSyncEnabled: boolean;
  };
  lastOrder?: {
    id: string;
    items: string[];
    timestamp: number;
    deliveryMode: 'pickup' | 'seat';
  };
  cloudStoragePath: string;
}

const STORAGE_KEY = 'smartstadium_cloud_mock';

export const storageService = {
  /**
   * Simulates writing data to a remote cloud bucket associated with Google UID
   */
  saveUserData: async (googleId: string, data: Partial<CloudUserMetadata>): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existing = storageService.getUserDataSync(googleId);
        const updated = { ...existing, ...data, id: googleId };
        
        const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        allData[googleId] = updated;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
        
        console.log(`[CloudStorage] Data synced for ${googleId} to bucket/user_data/meta.json`);
        resolve();
      }, 800);
    });
  },

  /**
   * Simulates fetching data from the cloud
   */
  getUserData: async (googleId: string): Promise<CloudUserMetadata | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = storageService.getUserDataSync(googleId);
        resolve(data);
      }, 1000);
    });
  },

  /**
   * Internal synchronous helper for local storage mock
   */
  getUserDataSync: (googleId: string): CloudUserMetadata | null => {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return allData[googleId] || null;
  },

  /**
   * Initializes a "storage bucket" for a new user
   */
  initializeBucket: async (googleId: string): Promise<void> => {
    const existing = storageService.getUserDataSync(googleId);
    if (!existing) {
      await storageService.saveUserData(googleId, {
        preferences: {
          lastAppVisited: 'Home',
          favoriteSports: ['Cricket'],
          isPremium: true,
          cloudSyncEnabled: true
        },
        cloudStoragePath: `gs://smartstadium-v4-bucket/users/${googleId}/`
      });
      console.log(`[CloudStorage] Provisioned new storage bucket for user ${googleId}`);
    }
  },

  /**
   * Syncs community posts to the cloud
   */
  syncPosts: async (posts: any[]): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(`${STORAGE_KEY}_posts`, JSON.stringify(posts));
        console.log(`[CloudStorage] Synced ${posts.length} posts to community_shard_01.json`);
        resolve();
      }, 500);
    });
  },

  /**
   * Fetches community posts from the cloud
   */
  getPosts: async (): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(`${STORAGE_KEY}_posts`) || '[]');
        resolve(posts);
      }, 600);
    });
  }
};
