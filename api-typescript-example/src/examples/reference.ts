import { client } from '../api-client';

// ============================================================================
// Example 7: Common Enums - Reference Data
// ============================================================================

/**
 * Example: Get all available symbols
 */
export async function exampleGetSymbols(): Promise<void> {
    console.log('\n=== Example: Get Available Symbols ===\n');

    try {
        const symbols = await client.getSymbols();

        console.log(`Found ${symbols.length} symbols:\n`);

        // Show first 20 symbols
        symbols.slice(0, 20).forEach((symbol) => {
            console.log(`  ${symbol.name}: ${symbol.friendlyName}`);
        });

        if (symbols.length > 20) {
            console.log(`  ... and ${symbols.length - 20} more`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Get available time intervals
 */
export async function exampleGetIntervals(): Promise<void> {
    console.log('\n=== Example: Get Available Intervals ===\n');

    try {
        const intervals = await client.getIntervals();

        console.log('Available time intervals:');
        intervals.forEach((interval) => {
            console.log(`  - ${interval}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Check API rate limits
 */
export async function exampleCheckRateLimits(): Promise<void> {
    console.log('\n=== Example: Check Rate Limits ===\n');

    try {
        const monthlyPermits = await client.getMonthlyAvailablePermits();
        const availablePermits = await client.getAvailablePermits();
        const allPermits = await client.getAllAvailablePermits();

        console.log(`Monthly available permits: ${monthlyPermits}`);
        console.log(`Currently available permits: ${availablePermits}`);
        console.log('All permits info:', allPermits);
    } catch (error) {
        console.error('Error:', error);
    }
}
