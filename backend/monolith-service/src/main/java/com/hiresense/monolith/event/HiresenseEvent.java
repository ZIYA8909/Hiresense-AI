package com.hiresense.monolith.event;

import java.time.LocalDateTime;
import java.util.Map;

public class HiresenseEvent {
    private String eventType;
    private String email;
    private LocalDateTime timestamp;
    private Map<String, Object> data;

    public HiresenseEvent(String eventType, String email, Map<String, Object> data) {
        this.eventType = eventType;
        this.email = email;
        this.timestamp = LocalDateTime.now();
        this.data = data;
    }

    public String getEventType() {
        return eventType;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Map<String, Object> getData() {
        return data;
    }
}
