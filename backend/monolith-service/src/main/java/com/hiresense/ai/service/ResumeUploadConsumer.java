package com.hiresense.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiresense.monolith.event.HiresenseEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class ResumeUploadConsumer {

    @Autowired
    private AiResumeService aiResumeService;

    @Autowired
    private GeminiClient geminiClient;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private ObjectMapper objectMapper;

    @EventListener
    public void listen(HiresenseEvent event) {
        try {
            String eventType = event.getEventType();
            if (!"RESUME_UPLOADED".equals(eventType)) {
                return;
            }

            Map<String, Object> data = event.getData();
            Long appId = Long.valueOf(data.get("applicationId").toString());
            String resumeUrl = (String) data.get("resumeUrl");
            String jobDesc = (String) data.get("jobDescription");

            System.out.println("[ResumeUploadListener] Triggered AI parsing for App ID: " + appId + ", Resume URL: " + resumeUrl);

            String mockResumeText = "Candidate Profile: Experienced Software Engineer specializing in Java, Spring Boot, Microservices, and Cloud systems. Built scalable backend APIs using Docker and AWS S3.";

            String aiAnalysisJson = aiResumeService.analyzeResume(mockResumeText, jobDesc);

            int atsScore = 75; 
            try {
                JsonNode root = objectMapper.readTree(aiAnalysisJson);
                if (root.has("atsScore")) {
                    atsScore = root.get("atsScore").asInt();
                }
            } catch (Exception parseEx) {
                System.err.println("[ResumeUploadListener] Warning: Failed to parse ATS score from JSON, using default.");
            }

            float[] resumeEmbedding = geminiClient.generateEmbedding(mockResumeText);

            Map<String, Object> processedData = new HashMap<>();
            processedData.put("applicationId", appId);
            processedData.put("resumeText", mockResumeText);
            processedData.put("atsScore", atsScore);
            processedData.put("aiAnalysis", aiAnalysisJson);
            processedData.put("resumeEmbedding", resumeEmbedding);

            HiresenseEvent responseEvent = new HiresenseEvent(
                    "RESUME_PROCESSED",
                    event.getEmail(),
                    processedData
            );

            eventPublisher.publishEvent(responseEvent);
            System.out.println("[ResumeUploadListener] Successfully published RESUME_PROCESSED event for Application ID " + appId);

        } catch (Exception e) {
            System.err.println("[ResumeUploadListener] Error processing resume upload: " + e.getMessage());
        }
    }
}
