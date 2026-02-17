package com.altfins.bot.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AltfinsRequest {
    private List<String> symbols;
    private String timeInterval;
    private List<String> displayType;
    private String coinTypeFilter;
}
