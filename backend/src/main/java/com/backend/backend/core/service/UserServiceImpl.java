package com.backend.backend.core.service;

import com.backend.backend.common.ApiResponse;
import com.backend.backend.core.dto.response.ResponseUserDTO;
import com.backend.backend.core.impl.UserService;
import com.backend.backend.core.mapper.response.ResponseUserMapper;
import com.backend.backend.data.models.User;
import com.backend.backend.data.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ResponseUserMapper responseUserMapper;

    @Override
    public ApiResponse<?> getUser(String email) {
        ApiResponse<ResponseUserDTO> apiResponse = new ApiResponse<>();
        Optional<User> user = userRepository.findByEmail(email);

        if(user == null){
            apiResponse.setMessage("User not found");
            apiResponse.setHttpStatusCode(HttpStatus.NO_CONTENT.value());
        }
        apiResponse.setData(responseUserMapper.apply(user.get()));
        apiResponse.setHttpStatusCode(HttpStatus.OK.value());

        return apiResponse;
    }
}
