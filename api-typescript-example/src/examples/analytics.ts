import { AnalyticsSearchRequest } from '../types';
import { client } from '../api-client';

// ============================================================================
// Example 3: Analytics - Technical Indicators
// ============================================================================

/**
 * Example: Get RSI history for Bitcoin
 */
export async function exampleAnalyticsRsi(): Promise<void> {
    console.log('\n=== Example: RSI Analytics History ===\n');

    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 14);

    const request: AnalyticsSearchRequest = {
        symbol: 'BTC',
        timeInterval: 'DAILY',
        analyticsType: 'RSI14',
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
    };

    try {
        const response = await client.getAnalyticsHistory(request, {
            page: 0,
            size: 14,
        });

        console.log('Bitcoin RSI(14) History:');
        response.content.forEach((item) => {
            const date = new Date(item.time).toLocaleDateString();
            console.log(`${date}: RSI = ${item.value}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Get SMA crossover data
 */
export async function exampleAnalyticsSma(): Promise<void> {
    console.log('\n=== Example: SMA Analytics ===\n');

    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    // Get SMA50 data
    const request: AnalyticsSearchRequest = {
        symbol: 'ETH',
        timeInterval: 'DAILY',
        analyticsType: 'SMA50',
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
    };

    try {
        const response = await client.getAnalyticsHistory(request);

        console.log('ETH SMA(50) History:');
        response.content.forEach((item) => {
            const date = new Date(item.time).toLocaleDateString();
            console.log(`${date}: SMA50 = $${parseFloat(String(item.value)).toFixed(2)}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Get all available analytic types
 */
export async function exampleGetAnalyticTypes(): Promise<void> {
    console.log('\n=== Example: Get Analytic Types ===\n');

    try {
        const types = await client.getAnalyticTypes();

        console.log(`Found ${types.length} analytic types:\n`);

        // Group by category
        const numerical = types.filter(t => t.isNumerical);
        const nonNumerical = types.filter(t => !t.isNumerical);

        console.log('Numerical indicators:');
        numerical.slice(0, 10).forEach((type) => {
            console.log(`  ${type.id}: ${type.friendlyName}`);
        });

        console.log(`\nNon-numerical indicators:`);
        nonNumerical.slice(0, 5).forEach((type) => {
            console.log(`  ${type.id}: ${type.friendlyName}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
