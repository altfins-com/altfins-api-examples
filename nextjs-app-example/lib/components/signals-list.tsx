/**
 * Signals List Component
 * Displays a list of available signals from Altfins API
 */

'use client';

import { useState, useEffect } from 'react';

interface SignalItem {
  nameBullish: string;
  nameBearish: string;
  trendSensitive: boolean;
  signalType: string;
  signalKey: string;
}

interface SignalsListProps {
  signals: SignalItem[];
  isLoading?: boolean;
}

export function SignalsList({ signals, isLoading = false }: SignalsListProps) {
  const [selectedSignal, setSelectedSignal] = useState<SignalItem | null>(null);

  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-blue-100 border border-blue-400 rounded">
        <p className="text-blue-700">⏳ Loading signals...</p>
      </div>
    );
  }

  if (!signals || signals.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
      <h2 className="text-2xl font-bold mb-4">📊 Available Signals ({signals.length})</h2>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {signals.map((signal) => {
          const displayName = signal.trendSensitive
            ? `${signal.nameBullish} / ${signal.nameBearish}`
            : signal.nameBullish;

          const isSelected = selectedSignal?.signalKey === signal.signalKey;

          return (
            <button
              key={signal.signalKey}
              onClick={() => setSelectedSignal(isSelected ? null : signal)}
              className={`p-3 text-left rounded-lg border-2 transition-all ${isSelected
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800 hover:border-blue-400'
                }`}
            >
              <div className="font-semibold text-sm">{displayName}</div>
              <div className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                {signal.trendSensitive ? '🔄 Trend Sensitive' : '📌 Standard'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Signal Detail */}
      {selectedSignal && (
        <div className="mt-6 p-4 bg-white rounded-lg border-2 border-blue-300">
          <h3 className="text-xl font-bold mb-3">📌 Signal Detail</h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Signal Key:</p>
              <p className="font-mono bg-gray-100 p-2 rounded text-sm">
                {selectedSignal.signalKey}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Signal Type:</p>
              <p className="font-mono bg-gray-100 p-2 rounded text-sm">
                {selectedSignal.signalType}
              </p>
            </div>

            {selectedSignal.trendSensitive ? (
              <>
                <div className="pt-2 border-t">
                  <p className="text-sm font-semibold text-green-700 mb-1">📈 Bullish:</p>
                  <p className="bg-green-50 p-2 rounded text-sm">{selectedSignal.nameBullish}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-700 mb-1">📉 Bearish:</p>
                  <p className="bg-red-50 p-2 rounded text-sm">{selectedSignal.nameBearish}</p>
                </div>
              </>
            ) : (
              <div className="pt-2 border-t">
                <p className="text-sm font-semibold mb-1">📌 Description:</p>
                <p className="bg-gray-50 p-2 rounded text-sm">{selectedSignal.nameBullish}</p>
              </div>
            )}

            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                ℹ️ {selectedSignal.trendSensitive
                  ? 'This signal is trend sensitive - it has different values for bullish and bearish directions'
                  : 'This signal is standard - it has one value regardless of trend direction'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded">
            <p className="text-xs text-gray-600">Standard Signals</p>
            <p className="text-2xl font-bold text-green-700">
              {signals.filter((s) => !s.trendSensitive).length}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-xs text-gray-600">Trend Sensitive</p>
            <p className="text-2xl font-bold text-blue-700">
              {signals.filter((s) => s.trendSensitive).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
