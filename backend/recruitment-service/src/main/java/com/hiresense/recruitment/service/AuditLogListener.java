package com.hiresense.recruitment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiresense.recruitment.model.AuditLog;
import com.hiresense.recruitment.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuditLogListener {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = {"user-events", "recruitment-events"}, groupId = "recruitment-audit-group")
    public void listen(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String eventType = (String) event.get("eventType");
            String email = (String) event.get("email");
            
            Object dataObj = event.get("data");
            String details = dataObj != null ? objectMapper.writeValueAsString(dataObj) : "";

            AuditLog log = AuditLog.builder()
                    .email(email)
                    .action(eventType)
                    .details(details)
                    .timestamp(LocalDateTime.now())
                    .build();

            auditLogRepository.save(log);
            System.out.println("[AuditLogListener] Saved audit log for event: " + eventType);
        } catch (Exception e) {
            System.err.println("[AuditLogListener] Error processing audit log event: " + e.getMessage());
        }
    }
}
