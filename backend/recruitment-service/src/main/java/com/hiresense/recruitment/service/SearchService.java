package com.hiresense.recruitment.service;

import com.hiresense.recruitment.model.Job;
import com.hiresense.recruitment.model.Application;
import com.hiresense.recruitment.model.elasticsearch.JobDoc;
import com.hiresense.recruitment.model.elasticsearch.CandidateDoc;
import com.hiresense.recruitment.repository.elasticsearch.JobDocRepository;
import com.hiresense.recruitment.repository.elasticsearch.CandidateDocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    @Autowired(required = false)
    private JobDocRepository jobDocRepository;

    @Autowired(required = false)
    private CandidateDocRepository candidateDocRepository;

    public void indexJob(Job job) {
        if (jobDocRepository == null) return;
        try {
            JobDoc doc = JobDoc.builder()
                    .id(job.getId().toString())
                    .title(job.getTitle())
                    .description(job.getDescription())
                    .requirements(job.getRequirements())
                    .companyName(job.getCompany().getName())
                    .location(job.getLocation())
                    .workType(job.getWorkType())
                    .jobType(job.getJobType())
                    .status(job.getStatus())
                    .build();
            jobDocRepository.save(doc);
        } catch (Exception e) {
            System.err.println("[SearchService] Warning: Elasticsearch indexJob failed: " + e.getMessage());
        }
    }

    public void indexCandidate(Application app) {
        if (candidateDocRepository == null) return;
        try {
            CandidateDoc doc = CandidateDoc.builder()
                    .id(app.getId().toString())
                    .candidateName(app.getCandidateName())
                    .candidateEmail(app.getCandidateEmail())
                    .skills("") 
                    .resumeText(app.getResumeText())
                    .atsScore(app.getAtsScore())
                    .status(app.getStatus().name())
                    .build();
            candidateDocRepository.save(doc);
        } catch (Exception e) {
            System.err.println("[SearchService] Warning: Elasticsearch indexCandidate failed: " + e.getMessage());
        }
    }

    public List<JobDoc> searchJobs(String query) {
        if (jobDocRepository == null) return new ArrayList<>();
        try {
            return jobDocRepository.findByTitleOrDescriptionOrRequirements(query, query, query);
        } catch (Exception e) {
            System.err.println("[SearchService] Warning: Elasticsearch searchJobs failed: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public List<CandidateDoc> searchCandidates(String query) {
        if (candidateDocRepository == null) return new ArrayList<>();
        try {
            return candidateDocRepository.findByCandidateNameOrSkillsOrResumeText(query, query, query);
        } catch (Exception e) {
            System.err.println("[SearchService] Warning: Elasticsearch searchCandidates failed: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
