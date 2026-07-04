package com.hiresense.ai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiAssistantService {

    @Autowired
    private GeminiClient geminiClient;

    public float[] queryToEmbedding(String query) {
        return geminiClient.generateEmbedding(query);
    }

    public String chatCareerCoach(String history, String userMessage) {
        String prompt = "You are an AI Career Coach named HireSense Coach. Your job is to help candidates improve their resume, give career advice, recommend job categories, suggest learning roadmaps, and provide interview tips.\n\n" +
                "Chat History:\n" + history + "\n" +
                "Candidate: " + userMessage + "\n" +
                "Coach:";

        return geminiClient.generateText(prompt);
    }
}
