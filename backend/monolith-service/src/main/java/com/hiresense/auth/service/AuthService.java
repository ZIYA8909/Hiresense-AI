package com.hiresense.auth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiresense.auth.dto.*;
import com.hiresense.auth.model.User;
import com.hiresense.auth.repository.UserRepository;
import com.hiresense.auth.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    @org.springframework.beans.factory.annotation.Qualifier("stringRedisTemplate")
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private org.springframework.context.ApplicationEventPublisher eventPublisher;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String REDIS_REFRESH_PREFIX = "refresh_token:";
    private static final String REDIS_OTP_PREFIX = "otp:";

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String otp = String.format("%06d", new Random().nextInt(1000000));
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .verified(false)
                .otp(otp)
                .otpExpiry(LocalDateTime.now().plusMinutes(5))
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        // Store OTP in Redis as well for fast validation
        redisTemplate.opsForValue().set(REDIS_OTP_PREFIX + request.getEmail(), otp, 5, TimeUnit.MINUTES);

        // Send OTP event via Kafka
        sendAuthEvent("USER_REGISTERED", user.getEmail(), Map.of("otp", otp, "name", user.getName()));

        return AuthResponse.builder()
                .email(user.getEmail())
                .role(user.getRole().name())
                .name(user.getName())
                .verified(false)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isVerified()) {
            // Re-trigger OTP
            String otp = String.format("%06d", new Random().nextInt(1000000));
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
            userRepository.save(user);

            redisTemplate.opsForValue().set(REDIS_OTP_PREFIX + user.getEmail(), otp, 5, TimeUnit.MINUTES);
            sendAuthEvent("OTP_RETRIGGERED", user.getEmail(), Map.of("otp", otp, "name", user.getName()));

            return AuthResponse.builder()
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .name(user.getName())
                    .verified(false)
                    .build();
        }

        String accessToken = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        // Cache Refresh Token in Redis with 7 days expiration matching JWT configuration
        redisTemplate.opsForValue().set(REDIS_REFRESH_PREFIX + user.getEmail(), refreshToken, 7, TimeUnit.DAYS);

        sendAuthEvent("USER_LOGGED_IN", user.getEmail(), Map.of("name", user.getName()));

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .name(user.getName())
                .verified(true)
                .build();
    }

    public AuthResponse verifyOtp(OtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String cachedOtp = redisTemplate.opsForValue().get(REDIS_OTP_PREFIX + request.getEmail());
        boolean isValid = false;

        if (cachedOtp != null && cachedOtp.equals(request.getOtp())) {
            isValid = true;
        } else if (user.getOtp() != null && user.getOtp().equals(request.getOtp()) && user.getOtpExpiry().isAfter(LocalDateTime.now())) {
            isValid = true;
        }

        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        // Remove OTP from Redis
        redisTemplate.delete(REDIS_OTP_PREFIX + request.getEmail());

        String accessToken = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        redisTemplate.opsForValue().set(REDIS_REFRESH_PREFIX + user.getEmail(), refreshToken, 7, TimeUnit.DAYS);

        sendAuthEvent("USER_VERIFIED", user.getEmail(), Map.of("name", user.getName()));

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .name(user.getName())
                .verified(true)
                .build();
    }

    public AuthResponse refreshToken(String token) {
        if (!tokenProvider.validateToken(token)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = tokenProvider.getEmailFromToken(token);
        String cachedToken = redisTemplate.opsForValue().get(REDIS_REFRESH_PREFIX + email);

        if (cachedToken == null || !cachedToken.equals(token)) {
            throw new RuntimeException("Refresh token is expired or not matched in session");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        // Update refresh token cache
        redisTemplate.opsForValue().set(REDIS_REFRESH_PREFIX + email, newRefreshToken, 7, TimeUnit.DAYS);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .name(user.getName())
                .verified(true)
                .build();
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.format("%06d", new Random().nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        redisTemplate.opsForValue().set(REDIS_OTP_PREFIX + email, otp, 5, TimeUnit.MINUTES);

        sendAuthEvent("FORGOT_PASSWORD_OTP", email, Map.of("otp", otp, "name", user.getName()));
    }

    public void resetPassword(ResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String cachedOtp = redisTemplate.opsForValue().get(REDIS_OTP_PREFIX + request.getEmail());
        boolean isValid = false;

        if (cachedOtp != null && cachedOtp.equals(request.getOtp())) {
            isValid = true;
        } else if (user.getOtp() != null && user.getOtp().equals(request.getOtp()) && user.getOtpExpiry().isAfter(LocalDateTime.now())) {
            isValid = true;
        }

        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        redisTemplate.delete(REDIS_OTP_PREFIX + request.getEmail());

        sendAuthEvent("PASSWORD_RESET_SUCCESS", request.getEmail(), Map.of("name", user.getName()));
    }

    private void sendAuthEvent(String eventType, String email, Map<String, Object> data) {
        try {
            com.hiresense.monolith.event.HiresenseEvent event = new com.hiresense.monolith.event.HiresenseEvent(eventType, email, data);
            eventPublisher.publishEvent(event);
        } catch (Exception e) {
            System.err.println("[AuthService] Warning: Failed to publish Spring event: " + e.getMessage());
        }
    }
}
