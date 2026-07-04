package com.hiresense.recruitment.repository.elasticsearch;

import com.hiresense.recruitment.model.elasticsearch.JobDoc;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobDocRepository extends ElasticsearchRepository<JobDoc, String> {
    List<JobDoc> findByTitleOrDescriptionOrRequirements(String title, String description, String requirements);
}
