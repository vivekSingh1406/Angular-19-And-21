package com.example.backend.controller;


import com.example.backend.dto.auth.SignInRequest;
import com.example.backend.dto.auth.SignUpRequest;
import com.example.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService service;

    @PostMapping("/signup")
    public String signUp(@Valid @RequestBody SignUpRequest request) {
        return service.signUp(request);
    }

    @PostMapping("/signin")
    public String signIn(@Valid @RequestBody SignInRequest request) {
        return service.signIn(request);
    }
}