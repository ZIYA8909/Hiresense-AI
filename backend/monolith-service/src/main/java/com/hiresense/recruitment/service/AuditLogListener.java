package com.hiresense.recruitment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiresense.monolith.event.HiresenseEvent;
import com.hiresense.recruitment.model.AuditLog;
import com.hiresense.recruitment.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuditLogListener {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @EventListener
    public void listen(HiresenseEvent event) {
        try {
            String eventType = event.getEventType();
            String email = event.getEmail();
            
            Object dataObj = event.getData();
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
