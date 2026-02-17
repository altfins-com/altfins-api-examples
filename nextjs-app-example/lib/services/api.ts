/**
 * API Service - Centralized service for calling external REST API endpoints
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  includeApiKey?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

/**
 * Default timeouts and headers
 */
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * API configuration
 */
interface ApiConfig {
  apiKey?: string;
  apiKeyHeader?: string;
}

let apiConfig: ApiConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  apiKeyHeader: 'X-API-Key',
};

/**
 * Sets API key and configuration
 * @param key API key
 * @param headerName HTTP header name (default: 'X-API-Key')
 */
export function setApiKey(key: string, headerName: string = 'X-API-Key'): void {
  apiConfig.apiKey = key;
  apiConfig.apiKeyHeader = headerName;
}

/**
 * Returns current API configuration
 */
export function getApiConfig(): ApiConfig {
  return apiConfig;
}

/**
 * Resets API configuration
 */
export function resetApiKey(): void {
  apiConfig.apiKey = undefined;
  apiConfig.apiKeyHeader = 'X-API-Key';
}

/**
 * Calls external REST API endpoint
 * @param url API endpoint URL
 * @param options Request options (method, headers, body, timeout)
 * @returns Promise with API response
 */
export async function callApi<T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT,
    includeApiKey = true,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Prepare headers with API key
    const finalHeaders: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...headers,
    };

    // Add API key if configured and includeApiKey is true
    if (includeApiKey && apiConfig.apiKey && apiConfig.apiKeyHeader) {
      finalHeaders[apiConfig.apiKeyHeader] = apiConfig.apiKey;
    }

    console.log(`[API] ${method} ${url}`);
    console.log('[API] Headers:', finalHeaders);

    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    console.log(`[API] Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorBody = '';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          errorBody = JSON.stringify(await response.json());
        } else {
          errorBody = await response.text();
        }
      } catch {
        errorBody = 'Failed to parse error response';
      }

      const errorMessage = `HTTP ${response.status} ${response.statusText}${errorBody ? ': ' + errorBody.substring(0, 200) : ''}`;
      console.error('[API] Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        status: response.status,
      };
    }

    let data: T;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = (await response.json()) as T;
      } else {
        data = (await response.text()) as unknown as T;
      }
    } catch (parseError) {
      console.error('[API] Parse Error:', parseError);
      return {
        success: false,
        error: 'Error parsing API response',
        status: response.status,
      };
    }

    console.log('[API] Success:', data);
    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    console.error('[API] Fetch Error:', error);

    if (errorMessage.includes('abort')) {
      return {
        success: false,
        error: `Timeout - request took longer than ${timeout}ms`,
      };
    }

    if (errorMessage.includes('Failed to fetch')) {
      return {
        success: false,
        error: `Fetch error: ${errorMessage}. Check URL, CORS settings and if server is available.`,
      };
    }

    return {
      success: false,
      error: `${errorMessage} (Typ: ${error instanceof TypeError ? 'Network Error' : 'Unknown'})`,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Helper methods for various HTTP methods
 */

export async function get<T = unknown>(
  url: string,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return callApi<T>(url, { method: 'GET', headers });
}

export async function post<T = unknown>(
  url: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return callApi<T>(url, { method: 'POST', body, headers });
}

export async function put<T = unknown>(
  url: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return callApi<T>(url, { method: 'PUT', body, headers });
}

export async function patch<T = unknown>(
  url: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return callApi<T>(url, { method: 'PATCH', body, headers });
}

export async function del<T = unknown>(
  url: string,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return callApi<T>(url, { method: 'DELETE', headers });
}
