package com.hiresense.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
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
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "recruitment-events", groupId = "ai-resume-parser-group")
    public void listen(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String eventType = (String) event.get("eventType");
            if (!"RESUME_UPLOADED".equals(eventType)) {
                return;
            }

            Map<String, Object> data = (Map<String, Object>) event.get("data");
            Long appId = Long.valueOf(data.get("applicationId").toString());
            String resumeUrl = (String) data.get("resumeUrl");
            String jobDesc = (String) data.get("jobDescription");

            System.out.println("[ResumeUploadConsumer] Triggered AI parsing for App ID: " + appId + ", Resume URL: " + resumeUrl);

            String mockResumeText = "Candidate Profile: Experienced Software Engineer specializing in Java, Spring Boot, Microservices, and Cloud systems. Built scalable backend APIs using Docker and AWS S3.";

            String aiAnalysisJson = aiResumeService.analyzeResume(mockResumeText, jobDesc);

            int atsScore = 75; 
            try {
                JsonNode root = objectMapper.readTree(aiAnalysisJson);
                if (root.has("atsScore")) {
                    atsScore = root.get("atsScore").asInt();
                }
            } catch (Exception parseEx) {
                System.err.println("[ResumeUploadConsumer] Warning: Failed to parse ATS score from JSON, using default.");
            }

            float[] resumeEmbedding = geminiClient.generateEmbedding(mockResumeText);

            Map<String, Object> processedData = new HashMap<>();
            processedData.put("applicationId", appId);
            processedData.put("resumeText", mockResumeText);
            processedData.put("atsScore", atsScore);
            processedData.put("aiAnalysis", aiAnalysisJson);
            processedData.put("resumeEmbedding", resumeEmbedding);

            Map<String, Object> responseEvent = new HashMap<>();
            responseEvent.put("eventType", "RESUME_PROCESSED");
            responseEvent.put("email", (String) event.get("email"));
            responseEvent.put("timestamp", LocalDateTime.now().toString());
            responseEvent.put("data", processedData);

            kafkaTemplate.send("recruitment-events", appId.toString(), objectMapper.writeValueAsString(responseEvent));
            System.out.println("[ResumeUploadConsumer] Successfully sent RESUME_PROCESSED event for Application ID " + appId);

        } catch (Exception e) {
            System.err.println("[ResumeUploadConsumer] Error processing resume upload: " + e.getMessage());
        }
    }
}
