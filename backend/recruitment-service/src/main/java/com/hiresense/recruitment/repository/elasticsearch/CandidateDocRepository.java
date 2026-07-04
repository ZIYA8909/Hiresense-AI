package com.hiresense.recruitment.repository.elasticsearch;

import com.hiresense.recruitment.model.elasticsearch.CandidateDoc;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CandidateDocRepository extends ElasticsearchRepository<CandidateDoc, String> {
    List<CandidateDoc> findByCandidateNameOrSkillsOrResumeText(String name, String skills, String resumeText);
}
