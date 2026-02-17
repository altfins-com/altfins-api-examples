/**
 * altFINS API TypeScript Types
 * 
 * This file contains all type definitions for the altFINS Public API v2.
 * Documentation: https://altfins.com/crypto-market-and-analytical-data-api2/documentation/api/public-api
 */

// ============================================================================
// Common Types
// ============================================================================

/**
 * Time intervals supported by the API
 */
export type TimeInterval =
  | 'MINUTES15'
  | 'HOURLY'
  | 'HOURS4'
  | 'HOURS12'
  | 'DAILY';

/**
 * Trend direction values
 */
export type TrendDirection =
  | 'BULLISH'
  | 'BEARISH';

/**
 * Signal filter values for trend analysis
 */
export type SignalFilterValue =
  | 'STRONG_DOWN'
  | 'DOWN'
  | 'NEUTRAL'
  | 'UP'
  | 'STRONG_UP';

/**
 * Cross analytic filter values
 */
export type CrossAnalyticFilterValue = 'ABOVE' | 'BELOW';

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  size: number;
  number: number;
  sort: SortInfo[];
  content: T[];
  totalElements: number;
  numberOfElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * Sort information in paginated responses
 */
export interface SortInfo {
  direction: string;
  property: string;
  ignoreCase: boolean;
  nullHandling: string;
  ascending: boolean;
  descending: boolean;
}

/**
 * Symbol information
 */
export interface Symbol {
  name: string;
  friendlyName: string;
}

/**
 * Value type information
 */
export interface ValueType {
  id: string;
  friendlyName: string;
}

/**
 * Analytic type information
 */
export interface AnalyticType {
  id: string;
  friendlyName: string;
  isNumerical: boolean;
}

// ============================================================================
// Screener Data Types
// ============================================================================

/**
 * Display types for screener data
 */
export type ScreenerDisplayType =
  | 'PERFORMANCE'
  | 'DOLLAR_VOLUME'
  | 'MARKET_CAP'
  | 'HIGH'
  | 'LOW'
  | 'PRICE_CHANGE_1D'
  | 'PRICE_CHANGE_1W'
  | 'PRICE_CHANGE_1M'
  | 'PRICE_CHANGE_3M'
  | 'PRICE_CHANGE_6M'
  | 'PRICE_CHANGE_1Y'
  | 'PRICE_CHANGE_YTD'
  | 'SMA5'
  | 'SMA10'
  | 'SMA20'
  | 'SMA30'
  | 'SMA50'
  | 'SMA100'
  | 'SMA200'
  | 'EMA9'
  | 'EMA12'
  | 'EMA13'
  | 'EMA26'
  | 'EMA50'
  | 'EMA100'
  | 'EMA200'
  | 'RSI9'
  | 'RSI14'
  | 'RSI25'
  | 'STOCH'
  | 'STOCH_SLOW'
  | 'STOCH_RSI'
  | 'CCI20'
  | 'ADX'
  | 'MOM'
  | 'MACD'
  | 'MACD_SIGNAL_LINE'
  | 'MACD_HISTOGRAM'
  | 'WILLIAMS'
  | 'BOLLINGER_BAND_LOWER'
  | 'BOLLINGER_BAND_UPPER'
  | 'SHORT_TERM_TREND'
  | 'MEDIUM_TERM_TREND'
  | 'LONG_TERM_TREND';

/**
 * Signal filter types
 */
export type SignalFilterType =
  | 'SHORT_TERM_TREND'
  | 'MEDIUM_TERM_TREND'
  | 'LONG_TERM_TREND';

/**
 * Request body for screener market data
 */
export interface ScreenerDataRequest {
  symbols?: string[];
  timeInterval?: TimeInterval;
  displayType?: ScreenerDisplayType[];
  numericFilterType?: string;
  gteFilter?: number;
  lteFilter?: number;
  signalFilterType?: SignalFilterType;
  signalFilterValue?: SignalFilterValue;
  crossAnalyticFilterType?: string;
  crossAnalyticFilterValue?: CrossAnalyticFilterValue;
  crossLookBackIntervals?: string;
  candlestickPatternFilterType?: string;
  candlestickLookBackIntervals?: string;
  minimumMarketCapValue?: number;
}

/**
 * Screener data item in response
 */
export interface ScreenerDataItem {
  symbol: string;
  name: string;
  timeInterval: TimeInterval;
  additionalData: Record<string, number | string>;
}

// ============================================================================
// OHLC Types
// ============================================================================

/**
 * OHLC snapshot request body
 */
export interface OhlcSnapshotRequest {
  symbols?: string[];
  timeInterval?: TimeInterval;
}

/**
 * OHLC data item
 */
export interface OhlcData {
  symbol: string;
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

/**
 * Historical OHLC request body
 */
export interface OhlcHistoryRequest {
  symbol: string;
  timeInterval?: TimeInterval;
  from?: string;
  to?: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

/**
 * Analytics search request body
 */
export interface AnalyticsSearchRequest {
  symbol: string;
  timeInterval?: TimeInterval;
  analyticsType: string;
  from?: string;
  to?: string;
}

/**
 * Analytics data item
 */
export interface AnalyticsDataItem {
  symbol: string;
  time: string;
  value: number | string;
  analyticsType: string;
}

// ============================================================================
// Technical Analysis Types
// ============================================================================

/**
 * Technical analysis data item
 */
export interface TechnicalAnalysisItem {
  symbol: string;
  friendlyName: string;
  updatedDate: string;
  nearTermOutlook: TrendDirection;
  patternType: string;
  patternStage: string;
  description: string;
  imgChartUrl: string;
  imgChartUrlDark: string;
  logoUrl: string;
}

// ============================================================================
// Signals Feed Types
// ============================================================================

/**
 * Signals feed search request body
 */
export interface SignalsFeedRequest {
  symbols?: string[];
  signals?: string[];
  direction?: TrendDirection;
  fromDate?: string;
  toDate?: string;
}

/**
 * Signal key information
 */
export interface SignalKey {
  nameBullish: string;
  nameBearish: string;
  trendSensitive: boolean;
  signalType: string;
  signalKey: string;
}

/**
 * Signal data item
 */
export interface SignalDataItem {
  symbol: string;
  signalKey: string;
  signalName: string;
  direction: TrendDirection;
  timestamp: string;
}

// ============================================================================
// News Summary Types
// ============================================================================

/**
 * News summary search request body
 */
export interface NewsSummaryRequest {
  fromDate: string;
  toDate: string;
}

/**
 * News summary item
 */
export interface NewsSummaryItem {
  messageId: number;
  sourceId: number;
  content: string;
  title: string;
  url: string;
  sourceName: string;
  timestamp: string;
}

// ============================================================================
// Query Parameters Types
// ============================================================================

/**
 * Common pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string[];
}

/**
 * Find news summary query parameters
 */
export interface FindNewsSummaryParams {
  MessageId: number;
  SourceId: number;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * API error response
 */
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}

/**
 * API configuration options
 */
export interface AltfinsApiConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}
