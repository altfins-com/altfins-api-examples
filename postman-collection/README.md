# 🚀 altFINS API v2 Postman Collection

This Postman collection provides a comprehensive set of requests for the **altFINS Crypto Market and Analytical Data API**. It allows users to access market screeners, technical analysis, trading signals, and historical OHLCV data.

## 📌 Links & Documentation
* **Official API Documentation:** [altFINS Documentation](https://altfins.com/crypto-market-and-analytical-data-api/documentation/api/public-api)
* **Platform Website:** [altfins.com](https://altfins.com)

---

## 🔐 Authentication Setup

The API uses **API Key** authentication. The collection is pre-configured to use a collection-level auth header:

1. Open the collection **altFINS api v2** in Postman.
2. Go to the **Authorization** tab.
3. Ensure the type is set to `API Key`.
4. Set the **Key** to `x-api-key`.
5. Enter your personal API key into the **Value** field.
6. Set **Add to** to `Header`.

---

## 📁 Available Modules

The collection is organized into the following folders:

* **📊 Screener Data**: Search for coins based on market cap, volume, and other specific filters. Includes endpoints for value types.
* **📉 OHLC**: Retrieve snapshot or historical price data (Open, High, Low, Close, Volume) for specific symbols like BTC.
* **🧠 Analytics**: Access historical analytical data such as Moving Averages (e.g., SMA10) and other technical indicators.
* **⚙️ Technical Analysis**: Direct access to calculated technical analysis data.
* **📡 Signals Feed**: Retrieve trading signals and signal keys for specific coins.
* **📰 News Summary**: Get AI-curated news summaries for specific date ranges.
