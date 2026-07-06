package com.hiresense.recruitment.service;

import com.hiresense.recruitment.model.Job;
import com.hiresense.recruitment.model.Company;
import com.hiresense.recruitment.repository.JobRepository;
import com.hiresense.recruitment.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private SearchService searchService;

    @Autowired
    private org.springframework.context.ApplicationEventPublisher eventPublisher;

    @CacheEvict(value = "popular_jobs", allEntries = true)
    public Job createJob(Job job, Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        job.setCompany(company);
        job.setStatus("ACTIVE");
        job.setCreatedAt(LocalDateTime.now());
        
        Job savedJob = jobRepository.save(job);
        
        searchService.indexJob(savedJob);

        sendJobEvent("JOB_POSTED", "system@hiresense.ai", Map.of("jobId", savedJob.getId(), "title", savedJob.getTitle()));

        return savedJob;
    }

    @Cacheable(value = "popular_jobs")
    public List<Job> getActiveJobs() {
        System.out.println("[JobService] Fetching active jobs from database (cache miss)...");
        return jobRepository.findAll().stream()
                .filter(job -> "ACTIVE".equals(job.getStatus()))
                .toList();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    @CacheEvict(value = "popular_jobs", allEntries = true)
    public Job updateJob(Long id, Job jobDetails) {
        Job job = getJobById(id);
        job.setTitle(jobDetails.getTitle());
        job.setDescription(jobDetails.getDescription());
        job.setRequirements(jobDetails.getRequirements());
        job.setSalaryRange(jobDetails.getSalaryRange());
        job.setLocation(jobDetails.getLocation());
        job.setWorkType(jobDetails.getWorkType());
        job.setJobType(jobDetails.getJobType());
        job.setStatus(jobDetails.getStatus());
        
        Job updatedJob = jobRepository.save(job);
        searchService.indexJob(updatedJob);
        return updatedJob;
    }

    public List<Job> findSemanticJobs(float[] queryEmbedding, int limit) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < queryEmbedding.length; i++) {
            sb.append(queryEmbedding[i]);
            if (i < queryEmbedding.length - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return jobRepository.findTopJobsBySemanticMatch(sb.toString(), limit);
    }

    private void sendJobEvent(String eventType, String email, Map<String, Object> data) {
        try {
            com.hiresense.monolith.event.HiresenseEvent event = new com.hiresense.monolith.event.HiresenseEvent(eventType, email, data);
            eventPublisher.publishEvent(event);
        } catch (Exception e) {
            System.err.println("[JobService] Warning: Failed to publish Spring event: " + e.getMessage());
        }
    }
}
