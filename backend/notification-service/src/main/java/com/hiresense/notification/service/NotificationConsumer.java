package com.hiresense.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class NotificationConsumer {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = {"user-events", "recruitment-events"}, groupId = "notification-ws-group")
    public void listen(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String eventType = (String) event.get("eventType");
            String email = (String) event.get("email");

            System.out.println("[NotificationConsumer] Received event: " + eventType + " for user: " + email);

            if (email != null && !email.isBlank()) {
                messagingTemplate.convertAndSendToUser(email, "/queue/notifications", event);
            }

            if ("JOB_POSTED".equals(eventType)) {
                messagingTemplate.convertAndSend("/topic/jobs", event);
            }

        } catch (Exception e) {
            System.err.println("[NotificationConsumer] Error processing WebSocket message: " + e.getMessage());
        }
    }
}
