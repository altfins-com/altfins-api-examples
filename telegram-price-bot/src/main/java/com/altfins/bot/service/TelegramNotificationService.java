package com.altfins.bot.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

@Service
@Slf4j
public class TelegramNotificationService extends TelegramLongPollingBot {

    @Value("${telegram.bot.username}")
    private String botUsername;

    @Value("${telegram.bot.chat-id}")
    private String chatId;

    public TelegramNotificationService(@Value("${telegram.bot.token}") String botToken) {
        super(botToken);
    }

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public void onUpdateReceived(Update update) {
        // We are not handling incoming messages for this requirement
    }

    public void sendNotification(String messageText) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId);
        message.setText(messageText);

        try {
            execute(message);
            log.info("Sent Telegram notification: {}", messageText);
        } catch (TelegramApiException e) {
            log.error("Failed to send Telegram notification", e);
        }
    }
}
