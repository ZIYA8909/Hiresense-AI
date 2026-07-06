package com.hiresense.recruitment.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String action; // e.g. USER_LOGGED_IN, JOB_POSTED, STATUS_UPDATED
    
    @Column(columnDefinition = "TEXT")
    private String details;
    
    private LocalDateTime timestamp;
}
