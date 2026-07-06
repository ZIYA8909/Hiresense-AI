package com.hiresense.notification.service;

import com.hiresense.monolith.event.HiresenseEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationConsumer {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void listen(HiresenseEvent event) {
        try {
            String eventType = event.getEventType();
            String email = event.getEmail();

            System.out.println("[NotificationListener] Received Spring Event: " + eventType + " for user: " + email);

            Map<String, Object> payload = new HashMap<>();
            payload.put("eventType", eventType);
            payload.put("email", email);
            payload.put("timestamp", event.getTimestamp().toString());
            payload.put("data", event.getData());

            if (email != null && !email.isBlank()) {
                messagingTemplate.convertAndSendToUser(email, "/queue/notifications", payload);
            }

            if ("JOB_POSTED".equals(eventType)) {
                messagingTemplate.convertAndSend("/topic/jobs", payload);
            }

        } catch (Exception e) {
            System.err.println("[NotificationListener] Error processing Spring Event: " + e.getMessage());
        }
    }
}
