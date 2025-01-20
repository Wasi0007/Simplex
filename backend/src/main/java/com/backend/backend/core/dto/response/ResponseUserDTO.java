package com.backend.backend.core.dto.response;


import lombok.Builder;
import lombok.Data;


@Builder
public record ResponseUserDTO(
        String firstName,
        String lastName,
        String email
) {
}
