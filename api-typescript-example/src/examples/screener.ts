import { ScreenerDataRequest } from '../types';
import { client } from '../api-client';

// ============================================================================
// Example 1: Screener Data - Filter Cryptocurrencies
// ============================================================================

/**
 * Example: Get screener data for BTC and ETH with performance metrics
 */
export async function exampleScreenerData(): Promise<void> {
    console.log('\n=== Example: Screener Data ===\n');

    const request: ScreenerDataRequest = {
        symbols: ['BTC', 'ETH'],
        timeInterval: 'DAILY',
        displayType: [
            'PERFORMANCE',
            'MARKET_CAP',
            'PRICE_CHANGE_1D',
            'PRICE_CHANGE_1W',
            'RSI14',
            'SMA50',
            'SMA200',
        ],
    };

    try {
        const response = await client.getScreenerData(request, {
            page: 0,
            size: 10,
        });

        console.log(`Total elements: ${response.totalElements}`);
        console.log(`Page ${response.number + 1} of ${response.totalPages}`);
        console.log('\nResults:');

        response.content.forEach((item) => {
            console.log(`\n${item.symbol} (${item.name}):`);
            console.log(`  Data: ${JSON.stringify(item.additionalData, null, 2)}`);
        });
    } catch (error) {
        console.error('Error fetching screener data:', error);
    }
}

/**
 * Example: Filter cryptocurrencies with RSI below 30 (oversold)
 */
export async function exampleScreenerWithFilters(): Promise<void> {
    console.log('\n=== Example: Screener with RSI Filter ===\n');

    const request: ScreenerDataRequest = {
        timeInterval: 'DAILY',
        displayType: ['PERFORMANCE', 'RSI14', 'MARKET_CAP'],
        numericFilterType: 'RSI14',
        lteFilter: 30, // RSI less than or equal to 30 (oversold)
        minimumMarketCapValue: 100000000, // Min $100M market cap
    };

    try {
        const response = await client.getScreenerData(request, {
            page: 0,
            size: 20,
        });

        console.log(`Found ${response.totalElements} oversold cryptocurrencies`);
        response.content.forEach((item) => {
            console.log(`${item.symbol}: RSI = ${item.additionalData['RSI14']}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Filter by trend signals
 */
export async function exampleScreenerWithTrendFilter(): Promise<void> {
    console.log('\n=== Example: Screener with Trend Filter ===\n');

    const request: ScreenerDataRequest = {
        timeInterval: 'DAILY',
        displayType: ['PERFORMANCE', 'SHORT_TERM_TREND', 'MEDIUM_TERM_TREND'],
        signalFilterType: 'SHORT_TERM_TREND',
        signalFilterValue: 'STRONG_UP',
    };

    try {
        const response = await client.getScreenerData(request, {
            page: 0,
            size: 10,
        });

        console.log(`Found ${response.totalElements} coins with strong uptrend`);
        response.content.forEach((item) => {
            console.log(`${item.symbol}: ${item.additionalData['SHORT_TERM_TREND']}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Get all available screener value types
 */
export async function exampleGetValueTypes(): Promise<void> {
    console.log('\n=== Example: Get Screener Value Types ===\n');

    try {
        const valueTypes = await client.getScreenerValueTypes();

        console.log(`Found ${valueTypes.length} value types:\n`);
        valueTypes.slice(0, 20).forEach((type) => {
            console.log(`  ${type.id}: ${type.friendlyName}`);
        });

        if (valueTypes.length > 20) {
            console.log(`  ... and ${valueTypes.length - 20} more`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
