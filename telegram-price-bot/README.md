# Telegram Bot - Crypto Price Monitor

A Spring Boot Telegram bot that monitors Bitcoin (BTC) price using the Altfins API and sends notifications when significant price changes occur.

## Features

*   **Real-time Monitoring**: Checks Bitcoin price every minute.
*   **Smart Notifications**: Sends a Telegram message only when the price changes by more than a configured threshold (default $100) compared to the last check.
*   **Altfins Integration**: Uses the Altfins API for reliable market data.

## Prerequisites

*   Java 21 or higher
*   Maven 3.8+
*   A Telegram Bot Token and Chat ID
*   An Altfins API Key

## Configuration

The application is configured via `src/main/resources/application.properties`. You generally don't need to change the code, just update this file.

### Default Configuration

```properties
# Altfins API Configuration
altfins.api.url=https://altfins.com/api/v2/public/screener-data/search-requests
altfins.api.key=YOUR_ALTFINS_API_KEY

# Telegram Bot Configuration
telegram.bot.token=YOUR_TELEGRAM_BOT_TOKEN
telegram.bot.username=YOUR_BOT_USERNAME
telegram.bot.chat-id=YOUR_CHAT_ID

# Price Monitor Configuration
price.monitor.threshold=100
```

You must replace `YOUR_ALTFINS_API_KEY`, `YOUR_TELEGRAM_BOT_TOKEN`, `YOUR_BOT_USERNAME`, and `YOUR_CHAT_ID` with your actual credentials.

## How to Run

1.  **Clone the repository** (if applicable).
2.  **Navigate to the project directory**.
3.  **Run with Maven**:

    ```bash
    mvn spring-boot:run
    ```

    Alternatively, you can build a jar file:

    ```bash
    mvn clean package
    java -jar target/telegram-bot-0.0.1-SNAPSHOT.jar
    ```

## Usage

Once the application starts, it will:
1.  Fetch the current Bitcoin price immediately.
2.  Log the initial price to the console.
3.  Schedule a job to check the price every minute (cron: `0 * * * * *`).
4.  If the price difference exceeds the configured threshold (`abs(current - last) > threshold`), a message will be sent to the configured Telegram chat.

## Project Structure

*   `src/main/java/com/altfins/bot/TelegramBotApplication.java`: Main entry point.
*   `src/main/java/com/altfins/bot/service/AltfinsApiService.java`: Handles communication with Altfins API.
*   `src/main/java/com/altfins/bot/service/PriceMonitorService.java`: value checking logic and scheduling.
*   `src/main/java/com/altfins/bot/service/TelegramNotificationService.java`: Sends messages to Telegram.
*   `src/main/java/com/altfins/bot/dto/`: Data Transfer Objects for API requests/responses.

## License

[MIT](LICENSE)
