package com.backend.backend.core.impl;

import com.backend.backend.common.ApiResponse;
import com.backend.backend.core.dto.response.ResponseUserDTO;
import org.springframework.http.ResponseEntity;

public interface UserService {
    ApiResponse<?> getUser(String email);
}
