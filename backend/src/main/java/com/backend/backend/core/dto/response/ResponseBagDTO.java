package com.backend.backend.core.dto.response;

import lombok.Builder;

import java.sql.Timestamp;

@Builder
public record ResponseBagDTO(
        Timestamp createdAt,
        String createdBy,
        Long lotNumber,
        Long bagNumber,
        Timestamp scannedOutDate,
        String scannedOutBy

) {
}
