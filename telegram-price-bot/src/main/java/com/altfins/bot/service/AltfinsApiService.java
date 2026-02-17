package com.altfins.bot.service;

import com.altfins.bot.dto.AltfinsRequest;
import com.altfins.bot.dto.AltfinsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class AltfinsApiService {

    private final RestClient restClient;
    private final String apiUrl;
    private final String apiKey;

    public AltfinsApiService(RestClient.Builder restClientBuilder,
                             @Value("${altfins.api.url}") String apiUrl,
                             @Value("${altfins.api.key}") String apiKey) {
        this.restClient = restClientBuilder.build();
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    public AltfinsResponse.CoinData getBitcoinPrice() {
        AltfinsRequest request = AltfinsRequest.builder()
                .symbols(List.of("BTC"))
                .timeInterval("DAILY")
                .displayType(List.of("MARKET_CAP", "DOLLAR_VOLUME"))
                .coinTypeFilter("REGULAR")
                .build();

        AltfinsResponse response = restClient.post()
                .uri(apiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .header("x-api-key", apiKey)
                .body(request)
                .retrieve()
                .body(AltfinsResponse.class);

        if (response != null && response.getContent() != null && !response.getContent().isEmpty()) {
            return response.getContent().get(0);
        }

        return null;
    }
}
