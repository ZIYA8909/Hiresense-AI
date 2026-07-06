package com.hiresense.recruitment.service;

import com.hiresense.recruitment.model.*;
import com.hiresense.recruitment.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private SearchService searchService;

    @Autowired
    private org.springframework.context.ApplicationEventPublisher eventPublisher;

    @CacheEvict(value = "candidate_profiles", key = "#candidateId")
    public Application applyForJob(Long jobId, Long candidateId, String name, String email, MultipartFile resumeFile) {
        Job job = jobService.getJobById(jobId);
        String resumeUrl = s3Service.uploadFile(resumeFile);

        Application application = Application.builder()
                .candidateId(candidateId)
                .candidateName(name)
                .candidateEmail(email)
                .job(job)
                .status(ApplicationStatus.APPLIED)
                .resumeUrl(resumeUrl)
                .resumeText("Resume uploaded. Processing with AI...") 
                .atsScore(0)
                .createdAt(LocalDateTime.now())
                .build();

        Application savedApp = applicationRepository.save(application);

        searchService.indexCandidate(savedApp);

        sendApplicationEvent("RESUME_UPLOADED", email, Map.of(
                "applicationId", savedApp.getId(),
                "resumeUrl", resumeUrl,
                "jobDescription", job.getDescription(),
                "jobRequirements", job.getRequirements()
        ));

        return savedApp;
    }

    @Cacheable(value = "candidate_profiles", key = "#candidateId")
    public List<Application> getApplicationsByCandidate(Long candidateId) {
        System.out.println("[ApplicationService] Fetching candidate applications (cache miss)...");
        return applicationRepository.findByCandidateId(candidateId);
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @CacheEvict(value = "candidate_profiles", key = "#result.candidateId", condition = "#result != null")
    public Application updateStatus(Long id, ApplicationStatus status) {
        Application application = getApplicationById(id);
        application.setStatus(status);

        Application updatedApp = applicationRepository.save(application);

        searchService.indexCandidate(updatedApp);

        sendApplicationEvent("APPLICATION_STATUS_UPDATED", application.getCandidateEmail(), Map.of(
                "applicationId", updatedApp.getId(),
                "status", status.name(),
                "candidateName", updatedApp.getCandidateName(),
                "jobTitle", updatedApp.getJob().getTitle()
        ));

        return updatedApp;
    }

    public List<Application> searchSemanticCandidates(Long jobId, float[] queryEmbedding, int limit) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < queryEmbedding.length; i++) {
            sb.append(queryEmbedding[i]);
            if (i < queryEmbedding.length - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return applicationRepository.findTopCandidatesBySemanticMatch(jobId, sb.toString(), limit);
    }

    private void sendApplicationEvent(String eventType, String email, Map<String, Object> data) {
        try {
            com.hiresense.monolith.event.HiresenseEvent event = new com.hiresense.monolith.event.HiresenseEvent(eventType, email, data);
            eventPublisher.publishEvent(event);
        } catch (Exception e) {
            System.err.println("[ApplicationService] Warning: Failed to publish Spring event: " + e.getMessage());
        }
    }
}
