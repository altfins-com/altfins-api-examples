/**
 * altFINS API Client
 * 
 * A TypeScript client for interacting with the altFINS Public API v2.
 * Documentation: https://altfins.com/crypto-market-and-analytical-data-api2/documentation/api/public-api
 */

import {
  AltfinsApiConfig,
  PaginatedResponse,
  PaginationParams,
  Symbol,
  ValueType,
  AnalyticType,
  ScreenerDataRequest,
  ScreenerDataItem,
  OhlcSnapshotRequest,
  OhlcData,
  OhlcHistoryRequest,
  AnalyticsSearchRequest,
  AnalyticsDataItem,
  TechnicalAnalysisItem,
  SignalsFeedRequest,
  SignalKey,
  SignalDataItem,
  NewsSummaryRequest,
  NewsSummaryItem,
  FindNewsSummaryParams,
} from './types';

/**
 * altFINS API Client class
 * 
 * Provides methods to interact with all altFINS Public API endpoints.
 */
export class AltfinsApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  /**
   * Creates a new AltfinsApiClient instance
   * 
   * @param config - API configuration options
   */
  constructor(config: AltfinsApiConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://altfins.com';
    this.timeout = config.timeout || 30000;
  }

  /**
   * Makes an HTTP request to the API
   */
  private async request<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    options?: {
      body?: object;
      params?: Record<string, string | number | string[] | undefined>;
    }
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add query parameters
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, v));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-API-KEY': this.apiKey,
    };

    if (method === 'POST' && options?.body) {
      headers['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // ============================================================================
  // Screener Data Endpoints
  // ============================================================================

  /**
   * Get Screener Market Data
   * 
   * Filter and discover crypto assets using the same powerful logic as the altFINS platform screener.
   * 
   * @param body - Screener filter criteria
   * @param pagination - Pagination parameters
   * @returns Paginated screener data results
   */
  async getScreenerData(
    body: ScreenerDataRequest,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<ScreenerDataItem>> {
    return this.request<PaginatedResponse<ScreenerDataItem>>(
      'POST',
      '/api/v2/public/screener-data/search-requests',
      {
        body,
        params: {
          page: pagination?.page,
          size: pagination?.size,
          sort: pagination?.sort,
        },
      }
    );
  }

  /**
   * Get Screener Market Data Types
   * 
   * Returns all available types of market data that can be used in screener queries.
   * 
   * @returns Array of value types
   */
  async getScreenerValueTypes(): Promise<ValueType[]> {
    return this.request<ValueType[]>(
      'GET',
      '/api/v2/public/screener-data/value-types'
    );
  }

  // ============================================================================
  // OHLC Endpoints
  // ============================================================================

  /**
   * Get OHLC Data (Snapshot)
   * 
   * Retrieves current market data for specified symbols.
   * If symbols array is empty, returns snapshot for all available symbols.
   * 
   * @param body - Snapshot request parameters
   * @returns Array of OHLC data
   */
  async getOhlcSnapshot(body: OhlcSnapshotRequest): Promise<OhlcData[]> {
    return this.request<OhlcData[]>(
      'POST',
      '/api/v2/public/ohlcv/snapshot-requests',
      { body }
    );
  }

  /**
   * Get Historical OHLC Data
   * 
   * Retrieve historical OHLC time-series data for a specific asset
   * within a defined date range and interval.
   * 
   * @param body - History request parameters
   * @param pagination - Pagination parameters
   * @returns Paginated OHLC data
   */
  async getOhlcHistory(
    body: OhlcHistoryRequest,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<OhlcData>> {
    return this.request<PaginatedResponse<OhlcData>>(
      'POST',
      '/api/v2/public/ohlcv/history-requests',
      {
        body,
        params: {
          page: pagination?.page,
          size: pagination?.size,
          sort: pagination?.sort,
        },
      }
    );
  }

  // ============================================================================
  // Analytics Endpoints
  // ============================================================================

  /**
   * Get Historical Analytics Data
   * 
   * Retrieves historical analytics data for a specific cryptocurrency symbol.
   * 
   * @param body - Analytics search parameters
   * @param pagination - Pagination parameters
   * @returns Paginated analytics data
   */
  async getAnalyticsHistory(
    body: AnalyticsSearchRequest,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<AnalyticsDataItem>> {
    return this.request<PaginatedResponse<AnalyticsDataItem>>(
      'POST',
      '/api/v2/public/analytics/search-requests',
      {
        body,
        params: {
          page: pagination?.page,
          size: pagination?.size,
          sort: pagination?.sort,
        },
      }
    );
  }

  /**
   * Get Analytic Types
   * 
   * Browse 150+ available analytical metrics before requesting data.
   * 
   * @returns Array of analytic types
   */
  async getAnalyticTypes(): Promise<AnalyticType[]> {
    return this.request<AnalyticType[]>(
      'GET',
      '/api/v2/public/analytics/types'
    );
  }

  // ============================================================================
  // Technical Analysis Endpoints
  // ============================================================================

  /**
   * Get Technical Analysis
   * 
   * Access curated, expert-led technical analysis covering 50+ major cryptocurrencies.
   * These are trade setups including entry zones, exit targets, stop-loss levels,
   * and clear technical reasoning.
   * 
   * @param options - Query options
   * @returns Paginated technical analysis data
   */
  async getTechnicalAnalysis(options?: {
    symbol?: string;
    page?: number;
    size?: number;
    sort?: string[];
  }): Promise<PaginatedResponse<TechnicalAnalysisItem>> {
    return this.request<PaginatedResponse<TechnicalAnalysisItem>>(
      'GET',
      '/api/v2/public/technical-analysis/data',
      {
        params: {
          symbol: options?.symbol,
          page: options?.page,
          size: options?.size,
          sort: options?.sort,
        },
      }
    );
  }

  // ============================================================================
  // Signals Feed Endpoints
  // ============================================================================

  /**
   * Get Signals Feed Data
   * 
   * Fetches a collection of trading signals generated by the altfins platform
   * within a specified time frame.
   * 
   * @param body - Signals feed filter criteria
   * @param pagination - Pagination parameters
   * @returns Paginated signals data
   */
  async getSignalsFeed(
    body: SignalsFeedRequest,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<SignalDataItem>> {
    return this.request<PaginatedResponse<SignalDataItem>>(
      'POST',
      '/api/v2/public/signals-feed/search-requests',
      {
        body,
        params: {
          page: pagination?.page,
          size: pagination?.size,
          sort: pagination?.sort,
        },
      }
    );
  }

  /**
   * Get Signal Keys
   * 
   * Returns a complete list of valid signal identifiers (keys).
   * Use these keys to filter the output of the signals feed endpoint.
   * 
   * @returns Array of signal keys
   */
  async getSignalKeys(): Promise<SignalKey[]> {
    return this.request<SignalKey[]>(
      'GET',
      '/api/v2/public/signals-feed/signal-keys'
    );
  }

  // ============================================================================
  // News Summary Endpoints
  // ============================================================================

  /**
   * Get News Summary
   * 
   * Query pre-processed summaries of market news articles from various sources.
   * NLP has been applied to extract key information from long-form text.
   * 
   * @param body - News summary search parameters
   * @param pagination - Pagination parameters
   * @returns Paginated news summary data
   */
  async getNewsSummary(
    body: NewsSummaryRequest,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<NewsSummaryItem>> {
    return this.request<PaginatedResponse<NewsSummaryItem>>(
      'POST',
      '/api/v2/public/news-summary/search-requests',
      {
        body,
        params: {
          page: pagination?.page,
          size: pagination?.size,
          sort: pagination?.sort,
        },
      }
    );
  }

  /**
   * Find News Summary
   * 
   * Fetch a single news summary by MessageId and SourceId.
   * 
   * @param params - Message and source identifiers
   * @returns Single news summary item
   */
  async findNewsSummary(params: FindNewsSummaryParams): Promise<NewsSummaryItem> {
    return this.request<NewsSummaryItem>(
      'POST',
      '/api/v2/public/news-summary/find-summary',
      {
        params: {
          MessageId: params.MessageId,
          SourceId: params.SourceId,
        },
      }
    );
  }

  // ============================================================================
  // Common Enums Endpoints
  // ============================================================================

  /**
   * Get Available Symbols
   * 
   * Returns all possible symbols (coin ids) used by other endpoints.
   * 
   * @returns Array of symbols
   */
  async getSymbols(): Promise<Symbol[]> {
    return this.request<Symbol[]>(
      'GET',
      '/api/v2/public/symbols'
    );
  }

  /**
   * Get Available Time Intervals
   * 
   * Returns all possible time intervals used by other endpoints.
   * 
   * @returns Array of interval strings
   */
  async getIntervals(): Promise<string[]> {
    return this.request<string[]>(
      'GET',
      '/api/v2/public/intervals'
    );
  }

  /**
   * Get Monthly Available Permits
   * 
   * Return count of your currently available permits for current month for rate limiter.
   * 
   * @returns Number of available permits
   */
  async getMonthlyAvailablePermits(): Promise<number> {
    return this.request<number>(
      'GET',
      '/api/v2/public/monthly-available-permits'
    );
  }

  /**
   * Get Available Permits
   * 
   * Return count of your currently available permits for rate limiter.
   * 
   * @returns Number of available permits
   */
  async getAvailablePermits(): Promise<number> {
    return this.request<number>(
      'GET',
      '/api/v2/public/available-permits'
    );
  }

  /**
   * Get All Available Permits
   * 
   * Return all available permits information.
   * 
   * @returns Permits information
   */
  async getAllAvailablePermits(): Promise<Record<string, number>> {
    return this.request<Record<string, number>>(
      'GET',
      '/api/v2/public/all-available-permits'
    );
  }
}

export default AltfinsApiClient;
