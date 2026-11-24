# Telegram Signal Bot

This Spring Boot application monitors Altfins signals and posts new signals to a Telegram chat.

## Prerequisites

- Java 21
- Maven
- Altfins API Key
- Telegram Bot Token & Chat ID

## Configuration

Supply these environment variables to the bot process before starting it. Use your secret manager for the two tokens.

| Variable | Value |
| --- | --- |
| `ALTFINS_API_KEY` | altFINS API key |
| `TELEGRAM_BOT_TOKEN` | BotFather token |
| `TELEGRAM_BOT_USERNAME` | Telegram bot username |
| `TELEGRAM_CHAT_ID` | Destination chat ID |

Set `monitoring.fixed-rate`, `altfins.symbols` and `altfins.signals` in `application.properties` to change the polling interval and filters.

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
