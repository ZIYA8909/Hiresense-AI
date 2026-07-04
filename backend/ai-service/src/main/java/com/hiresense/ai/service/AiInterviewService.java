package com.hiresense.ai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiInterviewService {

    @Autowired
    private GeminiClient geminiClient;

    public String generateQuestion(String role, String type, int questionIndex) {
        String prompt = "You are a senior tech lead and interviewer. Generate the next interview question for a candidate. " +
                "Role/Title: " + role + "\n" +
                "Interview Type: " + type + "\n" +
                "Question Index: " + questionIndex + " (out of 3)\n\n" +
                "Keep the question clear, engaging, and professional. Return ONLY the JSON object containing the question. " +
                "{\n" +
                "  \"questionId\": " + questionIndex + ",\n" +
                "  \"question\": \"Question text here\"\n" +
                "}";

        return geminiClient.generateText(prompt);
    }

    public String evaluateInterview(String role, String transcript) {
        String prompt = "You are an expert recruitment analyzer. " +
                "Evaluate the following interview transcript for a " + role + " role.\n\n" +
                "Transcript:\n" + transcript + "\n\n" +
                "Return a raw JSON object containing the evaluation scores and feedback exactly. Do not include markdown tags. " +
                "{\n" +
                "  \"feedback\": \"Summary overview of how the candidate performed\",\n" +
                "  \"technicalScore\": 85,\n" +
                "  \"communicationScore\": 80,\n" +
                "  \"confidenceScore\": 90,\n" +
                "  \"strengths\": \"Core strengths identified\",\n" +
                "  \"weaknesses\": \"Areas for improvements\",\n" +
                "  \"recommendedResources\": [\"resource link or book 1\", \"resource 2\"]\n" +
                "}";

        return geminiClient.generateText(prompt);
    }
}
