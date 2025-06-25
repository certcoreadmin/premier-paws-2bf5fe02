import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68576a66ff0f18a32bf5fe02", 
  requiresAuth: true // Ensure authentication is required for all operations
});
