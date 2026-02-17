/**
 * Altfins API Service
 * Service for calling Altfins API endpoints
 */

import { callApi, ApiResponse } from './api';

const ALTFINS_API_BASE = 'https://altfins.com/api/v2/public';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export interface SignalKey {
  [key: string]: unknown;
}

export interface SignalFeedResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

/**
 * Payload for Screener Search
 */
export interface ScreenerPayload {
  displayType: string[];
  numericFilterType?: string;
  gteFilter?: number;
  signalFilterType?: string;
  signalFilterValue?: string;
  minimumMarketCapValue: number;
  crossAnalyticFilterType?: string;
  crossAnalyticFilterValue?: string;
  crossLookBackIntervals?: number;
  candlestickPatternFilterType?: string;
  candlestickLookBackIntervals?: number;
  // Trend and Momentum fields
  crossAnalyticFilters?: CrossAnalyticFilter[];
  analyticsComparisonsFilters?: AnalyticsComparisonsFilter[];
  coinTypeFilter?: string;
  signalFilters?: SignalFilter[];
  numericFilters?: NumericFilter[];
  macdFilter?: string;
  macdHistogramFilter?: string;
  newHighInLastPeriodFilter?: string;
  candlestickPatternFilters?: CandlestickPatternFilter[];
}

export interface CandlestickPatternFilter {
  candlestickPatternFilterType: string;
  candlestickLookBackIntervals?: number;
}

export interface NumericFilter {
  numericFilterType: string;
  lteFilter?: number;
  gteFilter?: number;
}

export interface SignalFilter {
  signalFilterType: string;
  signalFilterValue: string;
}

export interface CrossAnalyticFilter {
  crossAnalyticFilterType: string;
  crossAnalyticFilterValue: string;
  crossLookBackIntervals?: number;
}

export interface AnalyticsComparisonsFilter {
  analyticsComparisonsFilterType: string;
  analyticsComparisonsFilterValue: string;
}

export interface ScreenerAdditionalData {
  RSI14?: string;
  MEDIUM_TERM_TREND?: string;
  MARKET_CAP?: string;
  [key: string]: unknown;
}

export interface ScreenerItem {
  symbol: string;
  name: string;
  lastPrice: string;
  additionalData: ScreenerAdditionalData;
}

export interface ScreenerResponse {
  content: ScreenerItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface SignalSearchPayload {
  signals: string[];
  trend: string;
  fromDate: string;
  toDate: string;
  symbols?: string[];
  [key: string]: unknown;
}

export class AltfinsService {
  private static instance: AltfinsService;
  private apiKey: string;
  private baseUrl: string;

  private constructor() {
    this.apiKey = API_KEY || '';
    this.baseUrl = ALTFINS_API_BASE;
  }

  public static getInstance(): AltfinsService {
    if (!AltfinsService.instance) {
      AltfinsService.instance = new AltfinsService();
    }
    return AltfinsService.instance;
  }

  /**
   * Gets signal keys from Altfins API
   */
  public async getSignalKeys(): Promise<SignalFeedResponse<SignalKey[]>> {
    return this.callEndpoint<SignalKey[]>('signals-feed/signal-keys', 'GET');
  }

  /**
   * Searches data via Screener API
   */
  public async searchScreenerData(
    payload: ScreenerPayload,
    page?: number,
    size?: number,
    sort?: string
  ): Promise<SignalFeedResponse<ScreenerResponse>> {
    let endpoint = 'screener-data/search-requests';
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (sort !== undefined) params.append('sort', sort);

    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }

    return this.callEndpoint<ScreenerResponse>(endpoint, 'POST', payload);
  }

  /**
   * Searches signals via Signals Feed API
   */
  public async searchSignals(
    payload: SignalSearchPayload,
    page?: number,
    size?: number,
    sort?: string
  ): Promise<SignalFeedResponse<unknown>> {
    let endpoint = 'signals-feed/search-requests';
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (sort !== undefined) params.append('sort', sort);

    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }

    return this.callEndpoint<unknown>(endpoint, 'POST', payload);
  }

  /**
   * Generic method for calling API
   */
  private async callEndpoint<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: unknown
  ): Promise<SignalFeedResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;

    const response = await callApi<T>(url, {
      method,
      headers: {
        'x-api-key': this.apiKey,
      },
      body,
      includeApiKey: false,
    });

    return {
      success: response.success,
      data: response.data,
      error: response.error,
      details: response.status, // Mapping status to details for debugging
    };
  }
}

// Export for easy use
export const altfinsService = AltfinsService.getInstance();
