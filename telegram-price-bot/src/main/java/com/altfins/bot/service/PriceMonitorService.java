package com.altfins.bot.service;

import com.altfins.bot.dto.AltfinsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class PriceMonitorService {

    private final AltfinsApiService altfinsApiService;
    private final TelegramNotificationService telegramNotificationService;

    @Value("${price.monitor.threshold}")
    private BigDecimal priceThreshold;

    private BigDecimal lastPrice;

    @Scheduled(cron = "0 * * * * *")
    public void checkBitcoinPrice() {
        log.info("Checking Bitcoin price...");
        try {
            AltfinsResponse.CoinData coinData = altfinsApiService.getBitcoinPrice();
            if (coinData != null) {
                BigDecimal currentPrice = coinData.getLastPrice();
                log.info("Current Bitcoin price: {}", currentPrice);

                if (lastPrice != null) {
                    BigDecimal difference = currentPrice.subtract(lastPrice);
                    if (difference.abs().compareTo(priceThreshold) > 0) {
                        boolean isIncrease = difference.compareTo(BigDecimal.ZERO) > 0;
                        String direction = isIncrease ? "increased" : "decreased";
                        String icon = isIncrease ? "📈 ⬆️" : "📉 ⬇️";

                        String message = String.format("%s Bitcoin price %s by %.2f$! New price: %.2f$",
                                icon, direction, difference.abs(), currentPrice);

                        telegramNotificationService.sendNotification(message);
                        lastPrice = currentPrice;
                    }
                } else {
                    lastPrice = currentPrice;
                    log.info("Initial price set to: {}", lastPrice);
                }
            } else {
                log.warn("Failed to retrieve Bitcoin price data.");
            }
        } catch (Exception e) {
            log.error("Error checking Bitcoin price", e);
        }
    }
}
