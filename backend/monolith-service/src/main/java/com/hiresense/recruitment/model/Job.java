package com.hiresense.recruitment.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    private String salaryRange;
    private String location;
    private String workType; // REMOTE, HYBRID, ONSITE
    private String jobType;  // FULL_TIME, INTERNSHIP

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private String status; // ACTIVE, ARCHIVED

    private LocalDateTime createdAt;

    @Convert(converter = VectorConverter.class)
    @Column(name = "job_embedding", columnDefinition = "vector(1536)")
    private float[] jobEmbedding;
}
