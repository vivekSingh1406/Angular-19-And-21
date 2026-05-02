package com.example.backend.service;


import com.example.backend.dto.auth.SignInRequest;
import com.example.backend.dto.auth.SignUpRequest;

public interface AuthService {

    String signUp(SignUpRequest request);

    String signIn(SignInRequest request);
}
