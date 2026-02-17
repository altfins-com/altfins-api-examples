package com.altfins.signalbot.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AltfinsRequest {
    private List<String> signals;
    private List<String> symbols;
}
