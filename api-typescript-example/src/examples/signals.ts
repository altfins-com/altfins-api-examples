import { SignalsFeedRequest } from '../types';
import { client } from '../api-client';

// ============================================================================
// Example 5: Signals Feed - Trading Signals
// ============================================================================

/**
 * Example: Get bullish trading signals
 */
export async function exampleSignalsFeed(): Promise<void> {
    console.log('\n=== Example: Signals Feed ===\n');

    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const request: SignalsFeedRequest = {
        symbols: ['BTC', 'SOL'],
        signals: [],
        direction: 'BULLISH',
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
    };
    console.log(request);
    try {
        const response = await client.getSignalsFeed(request, {
            page: 0,
            size: 20,
        });

        console.log(`Found ${response.totalElements} bullish signals\n`);

        response.content.forEach((item) => {
            const date = new Date(item.timestamp).toLocaleDateString();
            console.log(`${date} - ${item.symbol}: ${item.signalName} (${item.direction})`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Get signals with specific signal keys
 */
export async function exampleSignalsFeedWithKeys(): Promise<void> {
    console.log('\n=== Example: Signals Feed with Specific Keys ===\n');

    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    const request: SignalsFeedRequest = {
        signals: ['SIGNALS_SUMMARY_CHANNEL_UP', 'SIGNALS_SUMMARY_SMA_50_200'],
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
    };

    try {
        const response = await client.getSignalsFeed(request, {
            page: 0,
            size: 10,
        });

        console.log(`Found ${response.totalElements} signals\n`);
        response.content.forEach((item) => {
            console.log(`${item.symbol}: ${item.signalKey}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Get all available signal keys
 */
export async function exampleGetSignalKeys(): Promise<void> {
    console.log('\n=== Example: Get Signal Keys ===\n');

    try {
        const keys = await client.getSignalKeys();

        console.log(`Found ${keys.length} signal keys:\n`);

        keys.slice(0, 10).forEach((key) => {
            console.log(`${key.signalKey}:`);
            console.log(`  Bullish: ${key.nameBullish}`);
            console.log(`  Bearish: ${key.nameBearish}`);
            console.log(`  Type: ${key.signalType}`);
            console.log(`  Trend Sensitive: ${key.trendSensitive}`);
            console.log('');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
