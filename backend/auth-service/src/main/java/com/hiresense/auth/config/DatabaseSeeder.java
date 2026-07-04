package com.hiresense.auth.config;

import com.hiresense.auth.model.Role;
import com.hiresense.auth.model.User;
import com.hiresense.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Candidate User
        if (!userRepository.existsByEmail("arjun.mehta@gmail.com")) {
            User candidate = User.builder()
                    .name("Arjun Mehta")
                    .email("arjun.mehta@gmail.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.CANDIDATE)
                    .verified(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(candidate);
            System.out.println("[DatabaseSeeder] Seeded candidate user: arjun.mehta@gmail.com");
        }

        // Seed Recruiter User
        if (!userRepository.existsByEmail("ananya.iyer@techcorp.com")) {
            User recruiter = User.builder()
                    .name("Ananya Iyer")
                    .email("ananya.iyer@techcorp.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.RECRUITER)
                    .verified(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(recruiter);
            System.out.println("[DatabaseSeeder] Seeded recruiter user: ananya.iyer@techcorp.com");
        }
    }
}
