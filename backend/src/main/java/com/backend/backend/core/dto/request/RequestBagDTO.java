package com.backend.backend.core.dto.request;

import java.sql.Timestamp;
import java.time.LocalDate;

public record RequestBagDTO(
        Long lotNumber,
        Long bagNumber,
        Timestamp Date
) {
}
