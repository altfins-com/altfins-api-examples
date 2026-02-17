package com.altfins.bot.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AltfinsResponse {
    private List<CoinData> content;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CoinData {
        private String symbol;
        private String name;
        private BigDecimal lastPrice;
        private Map<String, String> additionalData;
    }
}
