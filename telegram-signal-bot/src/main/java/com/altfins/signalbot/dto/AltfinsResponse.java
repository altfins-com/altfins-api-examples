package com.altfins.signalbot.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AltfinsResponse {
    private List<SignalData> content;
    private long totalElements;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SignalData {
        private String timestamp;
        private String signalKey;
        private String signalName;
        private String symbol;
        private String lastPrice;
        private String marketCap;
        private String priceChange;
        private String direction;
        private String symbolName;
    }
}
