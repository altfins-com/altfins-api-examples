import { AltfinsApiClient } from './client';

// ============================================================================
// Initialize the API Client
// ============================================================================

/**
 * Create an instance of the altFINS API client
 * The example runner reads its credential from the environment.
 */
export const client = new AltfinsApiClient({
    apiKey: process.env.ALTFINS_API_KEY || '',
    baseUrl: 'https://altfins.com', // Optional, this is the default
    timeout: 30000, // Optional, 30 seconds default
});
