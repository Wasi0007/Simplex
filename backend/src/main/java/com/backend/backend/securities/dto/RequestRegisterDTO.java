package com.backend.backend.securities.dto;


import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RequestRegisterDTO {
    @NotEmpty(message = "First Name is mandatory")
    @NotBlank(message = "First Name is mandatory")
    private String firstName;
    @NotEmpty(message = "Last Name is mandatory")
    @NotBlank(message = "Last Name is mandatory")
    private String lastName;

    @Email(message = "Email not formatted")
    @NotEmpty(message = "Email is mandatory")
    @NotBlank(message = "Email is mandatory")
    private String email;
    @Size(min = 8, message = "Password should be minimum 8 characters long")
    @NotEmpty(message = "Email is mandatory")
    @NotBlank(message = "Email is mandatory")
    private String password;
}
