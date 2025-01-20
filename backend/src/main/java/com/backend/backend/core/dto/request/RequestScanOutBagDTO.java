package com.backend.backend.core.dto.request;


public record RequestScanOutBagDTO(
        Long lotNumber,
        Long bagNumber
) {
}
