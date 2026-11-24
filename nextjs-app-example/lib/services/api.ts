/**
 * API Service - Centralized service for calling external REST API endpoints
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
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
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const finalHeaders: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...headers,
    };

    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      redirect: 'error',
      cache: 'no-store',
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    console.log(`[API] Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}`,
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
