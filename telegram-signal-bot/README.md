# Telegram Signal Bot

This Spring Boot application monitors Altfins signals and posts new signals to a Telegram chat.

## Prerequisites

- Java 21
- Maven
- Altfins API Key
- Telegram Bot Token & Chat ID

## Configuration

Edit `src/main/resources/application.properties`:

```properties
altfins.api.url=https://altfins.com/api/v2/public/signals-feed/search-requests
altfins.api.key=YOUR_API_KEY
telegram.bot.token=YOUR_BOT_TOKEN
telegram.chat.id=YOUR_CHAT_ID
monitoring.fixed-rate=300000

# Optional: Configure monitored assets (default: BTC, ETH, ...)
altfins.symbols=BTC,ETH,XRP,LTC

# Optional: Configure monitored signals (default: all)
altfins.signals=FRESH_MOMENTUM_MACD_SIGNAL_LINE_CROSSOVER.TXT,SIGNALS_SUMMARY_SMA_50_200.TXT
```

## Running the Application

### Using Maven
```bash
mvn spring-boot:run
```

### Building a JAR
```bash
mvn clean package
java -jar target/telegram-signal-bot-0.0.1-SNAPSHOT.jar
```

## Logic
- The bot polls the Altfins API every 60 seconds (configurable).
- It tracks the timestamp of the last processed signal.
- Only signals with a timestamp *after* the last check are sent to Telegram.
- On startup, it sets the baseline to `Instant.now()`, so it will only alert on *future* signals.
