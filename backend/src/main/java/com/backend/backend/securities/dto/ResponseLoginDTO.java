package com.backend.backend.securities.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseLoginDTO {
    private String token;
}
