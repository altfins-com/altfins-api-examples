import { AltfinsApiClient } from './client';

// ============================================================================
// Initialize the API Client
// ============================================================================

/**
 * Create an instance of the altFINS API client
 * Replace 'YOUR_API_KEY' with your actual API key from the altFINS portal
 */
export const client = new AltfinsApiClient({
    apiKey: process.env.ALTFINS_API_KEY || 'your-api-key',
    baseUrl: 'https://altfins.com', // Optional, this is the default
    timeout: 30000, // Optional, 30 seconds default
});
