package com.altfins.signalbot.service;

import com.altfins.signalbot.dto.AltfinsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SignalMonitorService {

    private final AltfinsApiService altfinsApiService;
    private final TelegramNotificationService telegramNotificationService;

    private Instant lastCheckedTimestamp = Instant.now();

    @Scheduled(fixedRateString = "${monitoring.fixed-rate:60000}")
    public void checkSignals() {
        log.info("Checking signals...");
        try {
            AltfinsResponse response = altfinsApiService.fetchSignals();

            if (response == null || response.getContent() == null || response.getContent().isEmpty()) {
                log.debug("No signals found.");
                return;
            }

            List<AltfinsResponse.SignalData> newSignals = response.getContent().stream()
                    .filter(signal -> {
                        Instant signalTime = Instant.parse(signal.getTimestamp());
                        return signalTime.isAfter(lastCheckedTimestamp);
                    })
                    .sorted(Comparator.comparing(AltfinsResponse.SignalData::getTimestamp))
                    .toList();

            if (newSignals.isEmpty()) {
                log.info("No new signals since {}", lastCheckedTimestamp);
                return;
            }

            log.info("Found {} new signals.", newSignals.size());

            for (AltfinsResponse.SignalData signal : newSignals) {
                notifySignal(signal);

                Instant signalTime = Instant.parse(signal.getTimestamp());
                if (signalTime.isAfter(lastCheckedTimestamp)) {
                    lastCheckedTimestamp = signalTime;
                }
            }

        } catch (Exception e) {
            log.error("Error checking signals", e);
        }
    }

    private void notifySignal(AltfinsResponse.SignalData signal) {
        StringBuilder message = new StringBuilder();
        message.append("Direction: ").append(signal.getDirection()).append("\n");
        message.append("Coin: ").append(signal.getSymbol()).append(" (").append(signal.getSymbolName()).append(")\n");
        message.append("Signal: ").append(signal.getSignalName()).append("\n");
        message.append("Price: $").append(signal.getLastPrice()).append("\n");
        message.append("Change: ").append(signal.getPriceChange()).append("\n");
        message.append("Time: ").append(signal.getTimestamp());

        telegramNotificationService.sendNotification(message.toString());
    }
}
