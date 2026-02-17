/**
 * Altfins API Client (Browser-safe)
 * Calls Next.js API Route instead of calling external API directly
 */

import { SignalKey, SignalFeedResponse, ScreenerPayload, ScreenerResponse, ScreenerItem } from '../services/altfins';

export interface SignalItem {
    timestamp: string;
    signalKey: string;
    signalName: string;
    symbol: string;
    lastPrice: string;
    marketCap: string;
    priceChange: string;
    direction: string;
    symbolName: string;
}

export interface SignalsResponse {
    size: number;
    number: number;
    content: SignalItem[];
}

// Re-export for convenience
export type { SignalKey, SignalFeedResponse, ScreenerPayload, ScreenerResponse, ScreenerItem };

/**
 * Gets signal keys from Altfins API via Next.js API Route
 */
export async function getSignalKeys(): Promise<SignalFeedResponse<SignalKey[]>> {
    try {
        const response = await fetch('/api/altfins?endpoint=signals-feed/signal-keys');
        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `HTTP ${response.status}`,
                details: data.details,
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            error: `Error: ${errorMessage}`,
        };
    }
}

/**
 * Searches data via Screener API
 */
export async function searchScreenerData(
    payload: ScreenerPayload,
    page?: number,
    size?: number,
    sort?: string
): Promise<SignalFeedResponse<ScreenerResponse>> {
    try {
        const params = new URLSearchParams();
        params.append('endpoint', 'screener-data/search-requests');
        if (page !== undefined) params.append('page', page.toString());
        if (size !== undefined) params.append('size', size.toString());
        if (sort !== undefined) params.append('sort', sort);

        const response = await fetch(`/api/altfins?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `HTTP ${response.status}`,
                details: data.details,
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            error: `Error: ${errorMessage}`,
        };
    }
}

export interface SignalSearchPayload {
    signals: string[];
    trend: string;
    fromDate: string;
    toDate: string;
    symbols?: string[];
    [key: string]: unknown;
}

export async function searchSignals(
    payload: SignalSearchPayload,
    page?: number,
    size?: number,
    sort?: string
): Promise<SignalFeedResponse<unknown>> {
    console.log('[use-altfins] searchSignals payload:', payload);
    try {
        const params = new URLSearchParams();
        params.append('endpoint', 'signals-feed/search-requests');
        if (page !== undefined) params.append('page', page.toString());
        if (size !== undefined) params.append('size', size.toString());
        if (sort !== undefined) params.append('sort', sort);

        const response = await fetch(`/api/altfins?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('[use-altfins] searchSignals error data:', data);
            return {
                success: false,
                error: data.error || `HTTP ${response.status}`,
                details: data.details,
            };
        }

        const data = await response.json();
        console.log('[use-altfins] searchSignals success data:', data);
        return {
            success: true,
            data, // Ideally cast to SignalsResponse here if structure matches
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            error: `Error: ${errorMessage}`,
        };
    }
}
