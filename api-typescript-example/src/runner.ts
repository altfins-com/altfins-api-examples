import * as readline from 'readline';

import {
    exampleScreenerData,
    exampleScreenerWithFilters,
    exampleScreenerWithTrendFilter,
    exampleGetValueTypes,
} from './examples/screener';

import {
    exampleOhlcSnapshot,
    exampleOhlcHistory,
    exampleOhlcHourly,
} from './examples/ohlc';

import {
    exampleAnalyticsRsi,
    exampleAnalyticsSma,
    exampleGetAnalyticTypes,
} from './examples/analytics';

import {
    exampleTechnicalAnalysis,
    exampleTechnicalAnalysisForSymbol,
} from './examples/technical-analysis';

import {
    exampleSignalsFeed,
    exampleSignalsFeedWithKeys,
    exampleGetSignalKeys,
} from './examples/signals';

import {
    exampleNewsSummary,
    exampleFindNewsSummary,
} from './examples/news';

import {
    exampleGetSymbols,
    exampleGetIntervals,
    exampleCheckRateLimits,
} from './examples/reference';

const examples: Record<string, () => Promise<void>> = {
    '1. Screener: Basic Data': exampleScreenerData,
    '2. Screener: With Filters (RSI < 30)': exampleScreenerWithFilters,
    '3. Screener: With Trend Filter': exampleScreenerWithTrendFilter,
    '4. Screener: Get Value Types': exampleGetValueTypes,
    '5. OHLC: Snapshot': exampleOhlcSnapshot,
    '6. OHLC: History (BTC)': exampleOhlcHistory,
    '7. OHLC: Hourly (ETH)': exampleOhlcHourly,
    '8. Analytics: RSI History': exampleAnalyticsRsi,
    '9. Analytics: SMA Cross': exampleAnalyticsSma,
    '10. Analytics: Get Types': exampleGetAnalyticTypes,
    '11. Technical Analysis: All': exampleTechnicalAnalysis,
    '12. Technical Analysis: Specific Symbol': exampleTechnicalAnalysisForSymbol,
    '13. Signals: Feed': exampleSignalsFeed,
    '14. Signals: Specific Keys': exampleSignalsFeedWithKeys,
    '15. Signals: Get Keys': exampleGetSignalKeys,
    '16. News: Summary': exampleNewsSummary,
    '17. News: Find Specific': exampleFindNewsSummary,
    '18. Reference: Symbols': exampleGetSymbols,
    '19. Reference: Intervals': exampleGetIntervals,
    '20. Reference: Rate Limits': exampleCheckRateLimits,
};

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log('\n=== altFINS API Examples Runner ===\n');
    const keys = Object.keys(examples);
    keys.forEach((key) => console.log(key));
    console.log('0. Exit');

    const ask = () => {
        rl.question('\nEnter example number to run (0-20): ', async (answer) => {
            if (answer === '0') {
                console.log('Exiting...');
                rl.close();
                return;
            }

            const selectedKey = keys.find(k => k.startsWith(answer + '.'));
            if (selectedKey) {
                console.log(`\nRunning: ${selectedKey}...`);
                try {
                    await examples[selectedKey]();
                } catch (error) {
                    console.error('Error running example:', error);
                }
                ask(); // Ask again after completion
            } else {
                console.log('Invalid selection.');
                ask();
            }
        });
    };

    ask();
}

main().catch(console.error);
