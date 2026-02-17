import { OhlcSnapshotRequest, OhlcHistoryRequest } from '../types';
import { client } from '../api-client';

// ============================================================================
// Example 2: OHLC Data - Price History
// ============================================================================

/**
 * Example: Get current OHLC snapshot for multiple symbols
 */
export async function exampleOhlcSnapshot(): Promise<void> {
    console.log('\n=== Example: OHLC Snapshot ===\n');

    const request: OhlcSnapshotRequest = {
        symbols: ['BTC', 'ETH', 'SOL'],
        timeInterval: 'DAILY',
    };

    try {
        const data = await client.getOhlcSnapshot(request);

        console.log('Current OHLC Data:');
        data.forEach((item) => {
            console.log(`\n${item.symbol}:`);
            console.log(`  Time: ${item.time}`);
            console.log(`  Open: $${parseFloat(item.open).toLocaleString()}`);
            console.log(`  High: $${parseFloat(item.high).toLocaleString()}`);
            console.log(`  Low: $${parseFloat(item.low).toLocaleString()}`);
            console.log(`  Close: $${parseFloat(item.close).toLocaleString()}`);
            console.log(`  Volume: ${parseFloat(item.volume).toLocaleString()}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Get historical OHLC data for Bitcoin
 */
export async function exampleOhlcHistory(): Promise<void> {
    console.log('\n=== Example: OHLC History ===\n');

    // Get last 30 days of daily data
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    const request: OhlcHistoryRequest = {
        symbol: 'BTC',
        timeInterval: 'DAILY',
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
    };

    try {
        const response = await client.getOhlcHistory(request, {
            page: 0,
            size: 30,
            sort: ['time,desc'],
        });

        console.log(`Bitcoin OHLC History (last ${response.numberOfElements} days):`);
        console.log(`Total records: ${response.totalElements}\n`);

        response.content.slice(0, 5).forEach((item) => {
            const date = new Date(item.time).toLocaleDateString();
            console.log(`${date}: Open=$${parseFloat(item.open).toFixed(2)}, Close=$${parseFloat(item.close).toFixed(2)}`);
        });

        if (response.content.length > 5) {
            console.log(`... and ${response.content.length - 5} more records`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Get hourly OHLC data
 */
export async function exampleOhlcHourly(): Promise<void> {
    console.log('\n=== Example: Hourly OHLC Data ===\n');

    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setHours(fromDate.getHours() - 24); // Last 24 hours

    const request: OhlcHistoryRequest = {
        symbol: 'ETH',
        timeInterval: 'HOURLY',
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
    };

    try {
        const response = await client.getOhlcHistory(request, {
            page: 0,
            size: 24,
        });

        console.log(`ETH Hourly Data (last 24 hours):`);
        response.content.forEach((item) => {
            const time = new Date(item.time).toLocaleTimeString();
            console.log(`${time}: $${parseFloat(item.close).toFixed(2)}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
