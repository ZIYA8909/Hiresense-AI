package com.hiresense.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Component
public class GeminiClient {

    @Value("${app.ai.gemini-api-key:}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder().build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateText(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            System.out.println("[GeminiClient] Warning: Gemini API key is missing. Returning mock response.");
            return generateMockTextResponse(prompt);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

            Map<String, Object> part = Map.of("text", prompt);
            Map<String, Object> content = Map.of("parts", List.of(part));
            Map<String, Object> requestBody = Map.of("contents", List.of(content));

            String responseJson = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode rootNode = objectMapper.readTree(responseJson);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            System.err.println("[GeminiClient] Error calling Gemini API: " + e.getMessage() + ". Returning mock response.");
            return generateMockTextResponse(prompt);
        }
    }

    public float[] generateEmbedding(String text) {
        if (apiKey == null || apiKey.isBlank()) {
            return generateMockEmbedding();
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=" + apiKey;

            Map<String, Object> part = Map.of("text", text);
            Map<String, Object> content = Map.of("parts", List.of(part));
            Map<String, Object> requestBody = Map.of(
                    "model", "models/text-embedding-004",
                    "content", content
            );

            String responseJson = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode rootNode = objectMapper.readTree(responseJson);
            JsonNode valuesNode = rootNode.path("embedding").path("values");

            float[] embedding = new float[valuesNode.size()];
            for (int i = 0; i < valuesNode.size(); i++) {
                embedding[i] = (float) valuesNode.get(i).asDouble();
            }
            return embedding;
        } catch (Exception e) {
            System.err.println("[GeminiClient] Error generating embedding: " + e.getMessage() + ". Returning mock embedding.");
            return generateMockEmbedding();
        }
    }

    private float[] generateMockEmbedding() {
        Random rand = new Random();
        float[] mockVector = new float[1536];
        double sumSq = 0;
        for (int i = 0; i < 1536; i++) {
            mockVector[i] = rand.nextFloat() - 0.5f;
            sumSq += mockVector[i] * mockVector[i];
        }
        // Normalize the vector
        float norm = (float) Math.sqrt(sumSq);
        for (int i = 0; i < 1536; i++) {
            mockVector[i] /= norm;
        }
        return mockVector;
    }

    private String generateMockTextResponse(String prompt) {
        String lowerPrompt = prompt.toLowerCase();
        if (lowerPrompt.contains("resume") && lowerPrompt.contains("parse")) {
            return "{\n" +
                    "  \"skills\": [\"Java\", \"Spring Boot\", \"Docker\", \"Redis\", \"AWS\", \"TypeScript\", \"Next.js\"],\n" +
                    "  \"education\": [\"Bachelor of Science in Computer Science, State University (GPA: 3.8)\"],\n" +
                    "  \"experience\": [\"Software Engineer Intern at Tech Corp (6 months) - Built microservices backend using Spring Boot and Docker\"],\n" +
                    "  \"atsScore\": 85,\n" +
                    "  \"missingKeywords\": [\"Elasticsearch\", \"Kafka\"],\n" +
                    "  \"grammarSuggestions\": \"No errors detected.\",\n" +
                    "  \"formattingSuggestions\": \"Include certifications at the top.\",\n" +
                    "  \"salaryEstimate\": \"$85,000 - $105,000\",\n" +
                    "  \"improvementRecommendations\": \"Add projects showcasing event-driven systems using Kafka.\"\n" +
                    "}";
        } else if (lowerPrompt.contains("interview") && lowerPrompt.contains("question")) {
            return "{\n" +
                    "  \"questionId\": 1,\n" +
                    "  \"question\": \"Explain the difference between optimistic and pessimistic locking in databases, and when you would use each.\"\n" +
                    "}";
        } else if (lowerPrompt.contains("evaluate") || lowerPrompt.contains("feedback")) {
            return "{\n" +
                    "  \"feedback\": \"Excellent understanding of concurrency controls. Communication was clear and concise.\",\n" +
                    "  \"technicalScore\": 90,\n" +
                    "  \"communicationScore\": 85,\n" +
                    "  \"confidenceScore\": 88,\n" +
                    "  \"strengths\": \"Strong knowledge of database transactional isolation levels.\",\n" +
                    "  \"weaknesses\": \"Could elaborate more on distributed lock implementations (e.g., Redisson).\",\n" +
                    "  \"recommendedResources\": [\"High-Performance Java Persistence by Vlad Mihalcea\"]\n" +
                    "}";
        }
        return "This is a mock response from the HireSense AI Engine.";
    }
}
