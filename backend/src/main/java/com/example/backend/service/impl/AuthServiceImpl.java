package com.example.backend.service.impl;

import com.example.backend.dto.auth.SignInRequest;
import com.example.backend.dto.auth.SignUpRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String signUp(SignUpRequest request) {

        if (repository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        if (repository.existsByMobileNumber(request.getMobileNumber())) {
            return "Mobile number already exists";
        }

        User user = new User();

        user.setUserName(request.getUserName());

        // PASSWORD ENCODE
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        user.setCountry(request.getCountry());

        repository.save(user);

        return "User registered successfully";
    }

    @Override
    public String signIn(SignInRequest request) {

        User user = repository
                .findByUserName(request.getUserName())
                .orElse(null);

        if (user == null) {
            return "Invalid username";
        }

        boolean isMatch = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!isMatch) {
            return "Invalid password";
        }

        return "Login successful";
    }
}
