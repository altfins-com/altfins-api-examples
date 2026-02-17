/**
 * altFINS API Usage Examples
 * 
 * This file contains comprehensive examples for all altFINS Public API v2 endpoints.
 * Each example demonstrates proper usage with TypeScript types.
 * 
 * Documentation: https://altfins.com/crypto-market-and-analytical-data-api2/documentation/api/public-api
 */

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

// ============================================================================
// Main Function - Run All Examples
// ============================================================================

/**
 * Run all examples
 */
async function runAllExamples(): Promise<void> {
  console.log('='.repeat(60));
  console.log('altFINS API TypeScript Examples');
  console.log('='.repeat(60));

  // Screener Data Examples
  await exampleScreenerData();
  await exampleScreenerWithFilters();
  await exampleScreenerWithTrendFilter();
  await exampleGetValueTypes();

  // OHLC Examples
  await exampleOhlcSnapshot();
  await exampleOhlcHistory();
  await exampleOhlcHourly();

  // Analytics Examples
  await exampleAnalyticsRsi();
  await exampleAnalyticsSma();
  await exampleGetAnalyticTypes();

  // Technical Analysis Examples
  await exampleTechnicalAnalysis();
  await exampleTechnicalAnalysisForSymbol();

  // Signals Feed Examples
  await exampleSignalsFeed();
  await exampleSignalsFeedWithKeys();
  await exampleGetSignalKeys();

  // News Summary Examples
  await exampleNewsSummary();
  await exampleFindNewsSummary();

  // Common Enums Examples
  await exampleGetSymbols();
  await exampleGetIntervals();
  await exampleCheckRateLimits();

  console.log('\n' + '='.repeat(60));
  console.log('All examples completed!');
  console.log('='.repeat(60));
}

// Export examples for individual use
export {
  exampleScreenerData,
  exampleScreenerWithFilters,
  exampleScreenerWithTrendFilter,
  exampleGetValueTypes,
  exampleOhlcSnapshot,
  exampleOhlcHistory,
  exampleOhlcHourly,
  exampleAnalyticsRsi,
  exampleAnalyticsSma,
  exampleGetAnalyticTypes,
  exampleTechnicalAnalysis,
  exampleTechnicalAnalysisForSymbol,
  exampleSignalsFeed,
  exampleSignalsFeedWithKeys,
  exampleGetSignalKeys,
  exampleNewsSummary,
  exampleFindNewsSummary,
  exampleGetSymbols,
  exampleGetIntervals,
  exampleCheckRateLimits,
  runAllExamples,
};

// Run examples if this file is executed directly
// Uncomment the line below to run all examples:
//exampleScreenerWithFilters().catch(console.error);
