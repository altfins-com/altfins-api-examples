package com.altfins.signalbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SignalBotApplication {

	public static void main(String[] args) {
		SpringApplication.run(SignalBotApplication.class, args);
	}

}
