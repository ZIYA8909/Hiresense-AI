package com.hiresense.recruitment.model.elasticsearch;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Document(indexName = "candidates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateDoc {
    @Id
    private String id; // Matches application ID

    @Field(type = FieldType.Text, analyzer = "standard")
    private String candidateName;

    @Field(type = FieldType.Keyword)
    private String candidateEmail;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String skills; 

    @Field(type = FieldType.Text, analyzer = "standard")
    private String resumeText;

    @Field(type = FieldType.Integer)
    private Integer atsScore;

    @Field(type = FieldType.Keyword)
    private String status; 
}
