import { client } from '../api-client';

// ============================================================================
// Example 4: Technical Analysis - Expert Trade Setups
// ============================================================================

/**
 * Example: Get technical analysis for all cryptocurrencies
 */
export async function exampleTechnicalAnalysis(): Promise<void> {
    console.log('\n=== Example: Technical Analysis ===\n');

    try {
        const response = await client.getTechnicalAnalysis({
            page: 0,
            size: 5,
        });

        console.log(`Found ${response.totalElements} technical analysis reports\n`);

        response.content.forEach((item) => {
            console.log(`${item.symbol}:`);
            console.log(`  Name: ${item.friendlyName}`);
            console.log(`  Trend: ${item.nearTermOutlook}`);
            console.log(`  Pattern Type: ${item.patternType}`);
            console.log(`  Pattern Stage: ${item.patternStage}`);
            console.log(`  Description: ${item.description}`);
            console.log(`  Image URL: ${item.imgChartUrl}`);
            console.log(`  Image URL (Dark): ${item.imgChartUrlDark}`);
            console.log(`  Logo URL: ${item.logoUrl}`);
            console.log('');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Get technical analysis for a specific symbol
 */
export async function exampleTechnicalAnalysisForSymbol(): Promise<void> {
    console.log('\n=== Example: Technical Analysis for BTC ===\n');

    try {
        const response = await client.getTechnicalAnalysis({
            symbol: 'BTC',
            page: 0,
            size: 10,
        });

        console.log(`Found ${response.totalElements} BTC analysis reports\n`);

        response.content.forEach((item) => {
            console.log(`${item.symbol}:`);
            console.log(`  Name: ${item.friendlyName}`);
            console.log(`  Trend: ${item.nearTermOutlook}`);
            console.log(`  Pattern Type: ${item.patternType}`);
            console.log(`  Pattern Stage: ${item.patternStage}`);
            console.log(`  Description: ${item.description}`);
            console.log(`  Image URL: ${item.imgChartUrl}`);
            console.log(`  Image URL (Dark): ${item.imgChartUrlDark}`);
            console.log(`  Logo URL: ${item.logoUrl}`);
            console.log('');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
