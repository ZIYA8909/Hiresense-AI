package com.hiresense.recruitment.model.elasticsearch;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Document(indexName = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDoc {
    @Id
    private String id;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String title;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String requirements;

    @Field(type = FieldType.Keyword)
    private String companyName;

    @Field(type = FieldType.Keyword)
    private String location;

    @Field(type = FieldType.Keyword)
    private String workType;

    @Field(type = FieldType.Keyword)
    private String jobType;

    @Field(type = FieldType.Keyword)
    private String status;
}
