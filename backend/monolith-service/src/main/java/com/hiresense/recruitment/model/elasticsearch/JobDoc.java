package com.hiresense.recruitment.model.elasticsearch;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDoc {
    private String id;
    private String title;
    private String description;
    private String requirements;
    private String companyName;
    private String location;
    private String workType;
    private String jobType;
    private String status;
}
