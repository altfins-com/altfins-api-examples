package com.altfins.signalbot.service;

import com.altfins.signalbot.dto.AltfinsRequest;
import com.altfins.signalbot.dto.AltfinsResponse;
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
    private final List<String> signals;
    private final List<String> symbols;

    public AltfinsApiService(RestClient.Builder restClientBuilder,
            @Value("${altfins.api.url}") String apiUrl,
            @Value("${altfins.api.key}") String apiKey,
            @Value("#{'${altfins.signals:}'.split(',')}") List<String> signals,
            @Value("#{'${altfins.symbols}'.split(',')}") List<String> symbols) {
        this.restClient = restClientBuilder.build();
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.signals = signals.stream().filter(s -> !s.isBlank()).toList();
        this.symbols = symbols;
    }

    public AltfinsResponse fetchSignals() {
        AltfinsRequest request = AltfinsRequest.builder()
                .signals(signals)
                .symbols(symbols)
                .build();

        return restClient.post()
                .uri(apiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .header("x-api-key", apiKey)
                .body(request)
                .retrieve()
                .body(AltfinsResponse.class);
    }
}
