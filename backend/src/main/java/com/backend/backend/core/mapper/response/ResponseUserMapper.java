package com.backend.backend.core.mapper.response;


import com.backend.backend.core.dto.response.ResponseUserDTO;
import com.backend.backend.data.models.User;
import org.springframework.stereotype.Component;

@Component
public class ResponseUserMapper {

    public ResponseUserDTO apply(User user) {
        return new ResponseUserDTO(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );
    }
}
