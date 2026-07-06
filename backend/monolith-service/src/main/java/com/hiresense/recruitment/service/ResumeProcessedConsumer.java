package com.hiresense.recruitment.service;

import com.hiresense.monolith.event.HiresenseEvent;
import com.hiresense.recruitment.model.Application;
import com.hiresense.recruitment.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class ResumeProcessedConsumer {

    @Autowired
    private ApplicationRepository applicationRepository;

    @EventListener
    public void listen(HiresenseEvent event) {
        try {
            String eventType = event.getEventType();
            if (!"RESUME_PROCESSED".equals(eventType)) {
                return;
            }

            Map<String, Object> data = event.getData();
            Long appId = Long.valueOf(data.get("applicationId").toString());
            String resumeText = (String) data.get("resumeText");
            Integer atsScore = (Integer) data.get("atsScore");
            String aiAnalysis = (String) data.get("aiAnalysis");
            
            List<Double> embeddingList = (List<Double>) data.get("resumeEmbedding");
            float[] embedding = null;
            if (embeddingList != null) {
                embedding = new float[embeddingList.size()];
                for (int i = 0; i < embeddingList.size(); i++) {
                    embedding[i] = embeddingList.get(i).floatValue();
                }
            }

            Application app = applicationRepository.findById(appId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            app.setResumeText(resumeText);
            app.setAtsScore(atsScore);
            app.setAiAnalysis(aiAnalysis);
            app.setResumeEmbedding(embedding);

            applicationRepository.save(app);

            System.out.println("[ResumeProcessedConsumerListener] Successfully updated application ID " + appId + " with AI analysis and vector embeddings.");
        } catch (Exception e) {
            System.err.println("[ResumeProcessedConsumerListener] Error processing resume parsed event: " + e.getMessage());
        }
    }
}
