package com.hiresense.recruitment.service;

import com.hiresense.recruitment.model.Job;
import com.hiresense.recruitment.model.Application;
import com.hiresense.recruitment.model.elasticsearch.JobDoc;
import com.hiresense.recruitment.model.elasticsearch.CandidateDoc;
import com.hiresense.recruitment.repository.JobRepository;
import com.hiresense.recruitment.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public void indexJob(Job job) {
        // No-op: Monolith uses direct JPA Postgres queries, no Elasticsearch indexing needed
    }

    public void indexCandidate(Application app) {
        // No-op: Monolith uses direct JPA Postgres queries, no Elasticsearch indexing needed
    }

    public List<JobDoc> searchJobs(String query) {
        try {
            List<Job> jobs = jobRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrRequirementsContainingIgnoreCase(query, query, query);
            return jobs.stream()
                    .map(job -> JobDoc.builder()
                            .id(job.getId().toString())
                            .title(job.getTitle())
                            .description(job.getDescription())
                            .requirements(job.getRequirements())
                            .companyName(job.getCompany().getName())
                            .location(job.getLocation())
                            .workType(job.getWorkType())
                            .jobType(job.getJobType())
                            .status(job.getStatus())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("[SearchService] SQL searchJobs failed: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public List<CandidateDoc> searchCandidates(String query) {
        try {
            List<Application> apps = applicationRepository.findByCandidateNameContainingIgnoreCaseOrResumeTextContainingIgnoreCase(query, query);
            return apps.stream()
                    .map(app -> CandidateDoc.builder()
                            .id(app.getId().toString())
                            .candidateName(app.getCandidateName())
                            .candidateEmail(app.getCandidateEmail())
                            .skills("")
                            .resumeText(app.getResumeText())
                            .atsScore(app.getAtsScore())
                            .status(app.getStatus().name())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("[SearchService] SQL searchCandidates failed: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
