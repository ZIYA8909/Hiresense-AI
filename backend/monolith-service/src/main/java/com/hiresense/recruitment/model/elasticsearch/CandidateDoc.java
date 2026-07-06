package com.hiresense.recruitment.model.elasticsearch;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateDoc {
    private String id;
    private String candidateName;
    private String candidateEmail;
    private String skills; 
    private String resumeText;
    private Integer atsScore;
    private String status; 
}
