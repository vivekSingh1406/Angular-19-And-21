package com.example.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class SignInRequest {

    @NotBlank(message = "Username is required")
    private String userName;

    @NotBlank(message = "Password is required")
    private String password;
}