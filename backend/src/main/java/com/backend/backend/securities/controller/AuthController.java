package com.backend.backend.securities.controller;

import com.backend.backend.securities.dto.RequestLoginDTO;
import com.backend.backend.securities.dto.RequestRegisterDTO;
import com.backend.backend.securities.services.AuthenticationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

    private final AuthenticationService authenticationService;


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RequestRegisterDTO request
    ){
        authenticationService.register(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody @Valid RequestLoginDTO request
    ){
        return ResponseEntity.ok(authenticationService.login(request));
    }


}
