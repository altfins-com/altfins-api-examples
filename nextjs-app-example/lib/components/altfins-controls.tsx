'use client';

import { useState } from 'react';
import { getSignalKeys, searchScreenerData, searchSignals, ScreenerPayload, ScreenerResponse, ScreenerItem, SignalSearchPayload, SignalsResponse, SignalItem } from '../hooks/use-altfins';

export function AltfinsControls() {
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [result, setResult] = useState<unknown>(null);
    const [isTableMode, setIsTableMode] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPayload, setCurrentPayload] = useState<ScreenerPayload | null>(null);
    const [currentSignalPayload, setCurrentSignalPayload] = useState<SignalSearchPayload | null>(null);
    const [searchType, setSearchType] = useState<'screener' | 'signal' | null>(null);
    const [signalSymbol, setSignalSymbol] = useState('ETC');

    const performSearch = async (payload: ScreenerPayload, actionId: string, page: number = 0) => {
        setLoadingAction(actionId);
        setResult(null);
        setError(null);
        setIsTableMode(true);
        setSearchType('screener');

        try {
            // Pass payload without page/size, pass page and size as arguments
            const response = await searchScreenerData(payload, page, 20);
            if (response.success) {
                setResult(response.data);
                // Update pagination info
                if (response.data && typeof response.data === 'object' && 'totalPages' in response.data) {
                    setTotalPages((response.data as ScreenerResponse).totalPages);
                    setCurrentPage((response.data as ScreenerResponse).number);
                }
                setCurrentPayload(payload);
            } else {
                setError(response.error || 'Unknown error');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoadingAction(null);
        }
    };

    const performSignalSearch = async (payload: SignalSearchPayload, actionId: string, page: number = 0) => {
        setLoadingAction(actionId);
        setResult(null);
        setError(null);
        // We use isTableMode = true for Signals now too, effectively, or at least we want RenderPagination to show up
        // But the previous logic used isTableMode to discriminate renderTable(Screener) vs renderSignalsTable
        // Let's rely on searchType or data structure in renderContent, but for Pagination we need a flag
        // Let's keep isTableMode = false for signals as it was, but modify renderPagination to check searchType
        setIsTableMode(false);
        setSearchType('signal');

        console.log('[AltfinsControls] Sending Search Signals payload:', payload, 'page:', page);

        try {
            const response = await searchSignals(payload, page, 20);
            console.log('[AltfinsControls] Search Signals response:', response);

            if (response.success) {
                setResult(response.data);
                // Update pagination info - check if SignalsResponse has totalPages
                // Assuming it does have totalPages or we can infer it. 
                // If the API returns it (which we assume it does based on Spring Data REST conventions often used)
                if (response.data && typeof response.data === 'object') {
                    const data = response.data as any; // Cast to access potential fields
                    if ('totalPages' in data) {
                        setTotalPages(data.totalPages);
                        setCurrentPage(data.number);
                    } else if ('totalElements' in data) {
                        // Fallback calculation if only totalElements is present
                        setTotalPages(Math.ceil(data.totalElements / (data.size || 20)));
                        setCurrentPage(data.number);
                    }
                }
                setCurrentSignalPayload(payload);
            } else {
                setError(response.error || 'Unknown error');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoadingAction(null);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            if (searchType === 'screener' && currentPayload) {
                performSearch(currentPayload, 'PAGINATION', newPage);
            } else if (searchType === 'signal' && currentSignalPayload) {
                performSignalSearch(currentSignalPayload, 'PAGINATION', newPage);
            }
        }
    };

    const handleGetSignalKeys = async () => {
        setLoadingAction('SIGNAL_KEYS');
        setResult(null);
        setError(null);
        setIsTableMode(false);
        setSearchType(null); // Reset search type
        setCurrentPayload(null);
        setCurrentSignalPayload(null);

        try {
            const response = await getSignalKeys();
            if (response.success) {
                setResult(response.data);
            } else {
                setError(response.error || 'Unknown error');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoadingAction(null);
        }
    };





    const handleStrongUpTrend = async () => {
        const payload: ScreenerPayload = {
            displayType: ["SHORT_TERM_TREND", "MEDIUM_TERM_TREND", "LONG_TERM_TREND", "MARKET_CAP"],
            signalFilters: [
                {
                    signalFilterType: "SHORT_TERM_TREND",
                    signalFilterValue: "STRONG_UP"
                },
                {
                    signalFilterType: "MEDIUM_TERM_TREND",
                    signalFilterValue: "STRONG_UP"
                },
                {
                    signalFilterType: "LONG_TERM_TREND",
                    signalFilterValue: "STRONG_UP"
                }
            ],
            minimumMarketCapValue: 5000000,
            coinTypeFilter: "REGULAR"
        };
        await performSearch(payload, 'STRONG_UP', 0);
    };

    const handlePullback1WInUptrend = async () => {
        const payload: ScreenerPayload = {
            displayType: ["RSI14", "PRICE_CHANGE_1W", "MEDIUM_TERM_TREND", "LONG_TERM_TREND", "MARKET_CAP"],
            numericFilters: [
                {
                    numericFilterType: "PRICE_CHANGE_1W",
                    lteFilter: -0.05
                },
                {
                    numericFilterType: "RSI14",
                    lteFilter: 70
                }
            ],
            signalFilters: [
                {
                    signalFilterType: "MEDIUM_TERM_TREND",
                    signalFilterValue: "UP"
                },
                {
                    signalFilterType: "LONG_TERM_TREND",
                    signalFilterValue: "UP"
                }
            ],
            minimumMarketCapValue: 5000000,
            coinTypeFilter: "REGULAR"
        };
        await performSearch(payload, 'PULLBACK_1W_UPTREND', 0);
    };

    const handleMomentumUpTrendV1 = async () => {
        const payload: ScreenerPayload = {
            displayType: ["MEDIUM_TERM_TREND", "MACD", "MACD_SIGNAL_LINE", "MARKET_CAP"],
            signalFilters: [
                {
                    signalFilterType: "MEDIUM_TERM_TREND",
                    signalFilterValue: "UP"
                }
            ],
            crossAnalyticFilters: [
                {
                    crossAnalyticFilterType: "X_MACD_CROSS_MACD_SIGNAL_LINE",
                    crossAnalyticFilterValue: "ABOVE",
                    crossLookBackIntervals: 2
                }
            ],
            macdFilter: "BUY",
            minimumMarketCapValue: 5000000,
            coinTypeFilter: "REGULAR"
        };
        await performSearch(payload, 'MOMENTUM_UP_V1', 0);
    };

    const handleUpTrendFreshMomentum = async () => {
        const payload: ScreenerPayload = {
            displayType: ["MEDIUM_TERM_TREND", "MACD", "MACD_SIGNAL_LINE", "MARKET_CAP"],
            signalFilters: [
                {
                    signalFilterType: "MEDIUM_TERM_TREND",
                    signalFilterValue: "UP"
                }
            ],
            macdFilter: "BUY",
            macdHistogramFilter: "H2_UP",
            minimumMarketCapValue: 5000000,
            coinTypeFilter: "REGULAR"
        };
        await performSearch(payload, 'UPTREND_FRESH_MOMENTUM', 0);
    };

    const handleNewLocalHigh = async () => {
        const payload: ScreenerPayload = {
            displayType: ["PERFORMANCE", "MARKET_CAP", "IR_NEW_HIGH_CREATED"],
            newHighInLastPeriodFilter: "PERIODS_30",
            minimumMarketCapValue: 5000000,
            coinTypeFilter: "REGULAR"
        };
        await performSearch(payload, 'NEW_LOCAL_HIGH', 0);
    };

    const handleBullishPriceSMA200 = async () => {
        const payload: ScreenerPayload = {
            displayType: ["SMA200", "MARKET_CAP"],
            crossAnalyticFilters: [
                {
                    crossAnalyticFilterType: "X_LAST_PRICE_CROSS_SMA200",
                    crossAnalyticFilterValue: "ABOVE",
                    crossLookBackIntervals: 2
                }
            ],
            analyticsComparisonsFilters: [
                {
                    analyticsComparisonsFilterType: "LAST_PRICE_VS_SMA200",
                    analyticsComparisonsFilterValue: "ABOVE"
                }
            ],
            minimumMarketCapValue: 10000000,
            coinTypeFilter: "REGULAR"
        };
        await performSearch(payload, 'BULLISH_PRICE_SMA200', 0);
    };

    const handleDragonflyDoji = async () => {
        const payload: ScreenerPayload = {
            displayType: ["MARKET_CAP"],
            candlestickPatternFilters: [
                {
                    candlestickPatternFilterType: "CD_PERFECT_DRAGONFLY_DOJI",
                    candlestickLookBackIntervals: 2
                }
            ],
            minimumMarketCapValue: 5000000,
            coinTypeFilter: "REGULAR"
        };
        await performSearch(payload, 'DRAGONFLY_DOJI', 0);
    };

    const handleGravestoneDoji = async () => {
        const payload: ScreenerPayload = {
            displayType: ["MARKET_CAP"],
            candlestickPatternFilters: [
                {
                    candlestickPatternFilterType: "CD_PERFECT_GRAVESTONE_DOJI",
                    candlestickLookBackIntervals: 2
                }
            ],
            minimumMarketCapValue: 5000000,
            coinTypeFilter: "REGULAR"
        };
        await performSearch(payload, 'GRAVESTONE_DOJI', 0);
    };



    const handleSearchSignals = async () => {
        // Reuse logic but call specific function
        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

        const payload: SignalSearchPayload = {
            signals: [
                //"SIGNALS_SUMMARY_UNUSUAL_VOLUME_GAINERS_DECLINERS",
                //"SIGNALS_SUMMARY_MA_RIBBON"
            ],
            symbols: [
                signalSymbol.toUpperCase()
            ],
            trend: "BULLISH",
            fromDate: threeDaysAgo.toISOString(),
            toDate: now.toISOString()
        };

        await performSignalSearch(payload, 'SIGNAL_SEARCH', 0);
    };

    // Helper Component for Buttons
    const ActionButton = ({ onClick, action, label, loading, colorClass }: { onClick: () => void, action: string, label: string, loading: string | null, colorClass: string }) => (
        <button
            onClick={onClick}
            disabled={loading !== null}
            className={`flex items-center justify-center px-4 py-3 text-sm font-medium text-white transition-all rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${colorClass}`}
        >
            {loading === action ? (
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </span>
            ) : (
                label
            )}
        </button>
    );

    const renderPagination = () => {
        const showPagination = (searchType === 'screener' || searchType === 'signal') && totalPages > 1;

        if (!showPagination) return null;

        return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-b-xl">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || loadingAction !== null}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                >
                    Previous
                </button>
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Page <span className="text-zinc-900 dark:text-zinc-100">{currentPage + 1}</span> of <span className="text-zinc-900 dark:text-zinc-100">{totalPages}</span>
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1 || loadingAction !== null}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                >
                    Next
                </button>
            </div>
        );
    };

    const renderSignalKeys = (data: unknown) => {
        if (!Array.isArray(data) || data.length === 0) {
            return (
                <div className="p-12 text-center">
                    <p className="text-zinc-500 text-sm">No signal keys found.</p>
                </div>
            );
        }

        const uniqueNames = new Set<string>();
        data.forEach((item) => {
            if (typeof item === 'object' && item !== null) {
                const record = item as Record<string, unknown>;
                const trendSensitive = record.trendSensitive === true;
                const nameBullish = typeof record.nameBullish === 'string' ? record.nameBullish : null;
                const nameBearish = typeof record.nameBearish === 'string' ? record.nameBearish : null;

                if (trendSensitive) {
                    if (nameBullish) uniqueNames.add(nameBullish);
                    if (nameBearish) uniqueNames.add(nameBearish);
                } else {
                    if (nameBullish) uniqueNames.add(nameBullish);
                }
            }
        });

        const sortedNames = Array.from(uniqueNames).sort();

        return (
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Available Signal Keys</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                        {sortedNames.length} items
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {sortedNames.map((name, idx) => (
                        <div key={idx} className="group flex items-center p-3 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-emerald-500 mr-3 transition-colors"></div>
                            <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate font-mono text-xs" title={name}>
                                {name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderTable = (inputData: unknown) => {
        let data: ScreenerItem[] = [];

        if (inputData && typeof inputData === 'object' && 'content' in inputData && Array.isArray((inputData as any).content)) {
            data = (inputData as ScreenerResponse).content;
        } else if (Array.isArray(inputData)) {
            data = inputData as any;
        } else {
            return (
                <div className="p-6 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Invalid Data Format</h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                <p>Expected 'content' array in response.</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (!data || data.length === 0) {
            return (
                <div className="p-12 text-center border-b border-zinc-200 dark:border-zinc-800">
                    <p className="text-zinc-500">No results found matching your criteria.</p>
                </div>
            );
        }

        const firstItem = data[0];
        const additionalKeys = firstItem.additionalData ? Object.keys(firstItem.additionalData) : [];

        const formatHeader = (key: string) => {
            return key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
        };

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                    <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                Asset
                            </th>
                            {additionalKeys.map(key => (
                                <th key={key} scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    {formatHeader(key)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
                        {data.map((item, idx) => (
                            <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs ring-1 ring-indigo-200 dark:ring-indigo-800">
                                            {item.symbol.substring(0, 1)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-zinc-900 dark:text-white">{item.symbol}</div>
                                            <div className="text-xs text-zinc-500 dark:text-zinc-400">{item.name}</div>
                                        </div>
                                    </div>
                                </td>
                                {additionalKeys.map(key => {
                                    const value = item.additionalData ? item.additionalData[key] : '-';

                                    if (key.includes('TREND')) {
                                        const strValue = String(value);
                                        const isUp = strValue.toUpperCase().includes('UP');
                                        const isDown = strValue.toUpperCase().includes('DOWN');
                                        const isNeutral = !isUp && !isDown;

                                        return (
                                            <td key={key} className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isUp
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
                                                    : isDown
                                                        ? 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
                                                        : 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                                                    }`}>
                                                    {strValue}
                                                </span>
                                            </td>
                                        );
                                    }

                                    if (key === 'RSI14') {
                                        const num = parseFloat(String(value));
                                        return (
                                            <td key={key} className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono text-zinc-700 dark:text-zinc-300">
                                                <span className={num > 70 ? 'text-rose-600 font-bold' : num < 30 ? 'text-emerald-600 font-bold' : ''}>
                                                    {isNaN(num) ? value as React.ReactNode : num.toFixed(2)}
                                                </span>
                                            </td>
                                        );
                                    }

                                    if (key === 'MARKET_CAP') {
                                        return (
                                            <td key={key} className="px-6 py-4 whitespace-nowrap text-right text-sm text-zinc-700 dark:text-zinc-300 tabular-nums">
                                                ${typeof value === 'number' ? value.toLocaleString() : value as React.ReactNode}
                                            </td>
                                        );
                                    }

                                    return (
                                        <td key={key} className="px-6 py-4 whitespace-nowrap text-right text-sm text-zinc-700 dark:text-zinc-300">
                                            {String(value)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderRawJson = (data: unknown) => {
        return (
            <div className="bg-zinc-900 text-zinc-100 p-4 rounded-b-xl overflow-auto max-h-[500px] text-xs font-mono border-t border-zinc-800">
                <div className="flex justify-between items-center mb-2 px-2">
                    <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Response Data</span>
                </div>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    };

    const renderSignalsTable = (inputData: unknown) => {
        let data: SignalItem[] = [];

        if (inputData && typeof inputData === 'object' && 'content' in inputData && Array.isArray((inputData as any).content)) {
            data = (inputData as SignalsResponse).content;
        } else if (Array.isArray(inputData)) {
            data = inputData as any;
        } else {
            return renderRawJson(inputData);
        }
        if (!data || data.length === 0) {
            return (
                <div className="p-12 text-center border-b border-zinc-200 dark:border-zinc-800">
                    <p className="text-zinc-500">No signals found.</p>
                </div>
            );
        }

        const timeAgo = (dateString: string) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffSec = Math.floor(diffMs / 1000);
            const diffMin = Math.floor(diffSec / 60);
            const diffHr = Math.floor(diffMin / 60);
            const diffDays = Math.floor(diffHr / 24);

            if (diffDays > 0) return `${diffDays}d ago`;
            if (diffHr > 0) return `${diffHr}h ago`;
            if (diffMin > 0) return `${diffMin}m ago`;
            return 'just now';
        };

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                    <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Asset</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Signal</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Time</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">24h Change</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Direction</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
                        {data.map((item, idx) => {
                            const priceChangeValue = parseFloat(item.priceChange?.replace('%', '') || '0');
                            const isPositiveChange = priceChangeValue >= 0;

                            return (
                                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-bold text-zinc-900 dark:text-white">{item.symbol}</div>
                                            <span className="ml-2 text-xs text-zinc-500">{item.symbolName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                            {item.signalName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-zinc-500">
                                        {timeAgo(item.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-zinc-900 dark:text-zinc-100 font-mono">
                                        ${item.lastPrice}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${isPositiveChange ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {isPositiveChange ? '+' : ''}{item.priceChange}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {item.direction === 'BULLISH' ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderContent = () => {
        if (!result) return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Ready to Search</h3>
                <p className="max-w-xs mx-auto mt-1 text-sm text-zinc-500">
                    Select one of the query options above to fetch data from the Altfins API.
                </p>
            </div>
        );

        if (isTableMode) {
            return (
                <div className="flex flex-col">
                    {renderTable(result)}
                    {renderPagination()}
                </div>
            );
        }

        if (result && typeof result === 'object' && 'content' in result) {
            const content = (result as any).content;
            if (Array.isArray(content) && content.length > 0 && 'signalKey' in content[0]) {
                return (
                    <div className="flex flex-col">
                        {renderSignalsTable(result)}
                        {renderPagination()}
                    </div>
                );
            }
        }

        if (Array.isArray(result)) {
            return renderSignalKeys(result);
        }

        return renderRawJson(result);
    };

    return (
        <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
            {/* Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Screener Presets */}
                <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            Screener Presets
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                        <ActionButton
                            onClick={handleStrongUpTrend}
                            action='STRONG_UP'
                            label="Strong UpTrend"
                            loading={loadingAction}
                            colorClass="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                        />
                        <ActionButton
                            onClick={handlePullback1WInUptrend}
                            action='PULLBACK_1W_UPTREND'
                            label="Pullback (1W) in Uptrend"
                            loading={loadingAction}
                            colorClass="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                        />
                        <ActionButton
                            onClick={handleMomentumUpTrendV1}
                            action='MOMENTUM_UP_V1'
                            label="Momentum & UpTrend (v1)"
                            loading={loadingAction}
                            colorClass="w-full bg-violet-600 hover:bg-violet-700 focus:ring-violet-500"
                        />
                        <ActionButton
                            onClick={handleUpTrendFreshMomentum}
                            action='UPTREND_FRESH_MOMENTUM'
                            label="UpTrend & Fresh Momentum"
                            loading={loadingAction}
                            colorClass="w-full bg-fuchsia-600 hover:bg-fuchsia-700 focus:ring-fuchsia-500"
                        />
                        <ActionButton
                            onClick={handleNewLocalHigh}
                            action='NEW_LOCAL_HIGH'
                            label="New Local High"
                            loading={loadingAction}
                            colorClass="w-full bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
                        />
                        <ActionButton
                            onClick={handleBullishPriceSMA200}
                            action='BULLISH_PRICE_SMA200'
                            label="Bullish Price / SMA 200"
                            loading={loadingAction}
                            colorClass="w-full bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500"
                        />
                    </div>
                    <div className="px-6 pb-6 pt-0">
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Pattern Recognition</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ActionButton
                                onClick={handleDragonflyDoji}
                                action='DRAGONFLY_DOJI'
                                label="Perfect Dragonfly"
                                loading={loadingAction}
                                colorClass="w-full bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                            />
                            <ActionButton
                                onClick={handleGravestoneDoji}
                                action='GRAVESTONE_DOJI'
                                label="Perfect Gravestone"
                                loading={loadingAction}
                                colorClass="w-full bg-stone-600 hover:bg-stone-700 focus:ring-stone-500"
                            />
                        </div>
                    </div>
                </div>

                {/* System & Signals */}
                <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
                    <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Signals & System
                        </h3>
                    </div>
                    <div className="p-6 flex flex-col gap-6 flex-grow">
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="signal-symbol" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Asset Symbol</label>
                                </div>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        id="signal-symbol"
                                        value={signalSymbol}
                                        onChange={(e) => setSignalSymbol(e.target.value)}
                                        className="flex-1 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all uppercase placeholder-zinc-400"
                                        placeholder="e.g. BTC"
                                    />
                                </div>
                                <ActionButton
                                    onClick={handleSearchSignals}
                                    action='SIGNAL_SEARCH'
                                    label={`Search Signals (${signalSymbol || '...'})`}
                                    loading={loadingAction}
                                    colorClass="w-full bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
                                />
                                <p className="mt-2 text-xs text-zinc-500">
                                    Find recent bullish signals for specific assets.
                                </p>
                            </div>

                            <hr className="border-dashed border-zinc-200 dark:border-zinc-800" />

                            <div>
                                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">System Info</div>
                                <ActionButton
                                    onClick={handleGetSignalKeys}
                                    action='SIGNAL_KEYS'
                                    label="View Signal Keys"
                                    loading={loadingAction}
                                    colorClass="w-full bg-zinc-600 hover:bg-zinc-700 focus:ring-zinc-500"
                                />
                                <p className="mt-2 text-xs text-zinc-500">
                                    List all available signal types and their keys.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error Occurred</h3>
                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                </div>
            )}

            {/* Results Area */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[400px]">
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                        Results ({result && 'totalPages' in (result as any) ? (result as any).totalElements || 'Multi' : '0'})
                    </h3>
                    <div className="flex gap-2">
                        {/* Toolbar place holder */}
                    </div>
                </div>
                <div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
