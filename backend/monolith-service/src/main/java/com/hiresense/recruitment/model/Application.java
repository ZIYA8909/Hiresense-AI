package com.hiresense.recruitment.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long candidateId;

    private String candidateName;
    private String candidateEmail;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private String resumeUrl;
    
    @Column(columnDefinition = "TEXT")
    private String resumeText;

    private Integer atsScore;

    @Column(columnDefinition = "TEXT")
    private String aiAnalysis; // Store JSON string from AI Service

    @Convert(converter = VectorConverter.class)
    @Column(name = "resume_embedding", columnDefinition = "vector(1536)")
    private float[] resumeEmbedding;

    private LocalDateTime createdAt;
}
