package com.backend.backend.core.dto.request;

import lombok.Builder;

@Builder
public record RequestUserDTO(
        String firstName,
        String lastName,
        String email
) {
}
