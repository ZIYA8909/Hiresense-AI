package com.hiresense.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AiResumeService {

    @Autowired
    private GeminiClient geminiClient;

    @Autowired
    private ObjectMapper objectMapper;

    public String analyzeResume(String resumeText, String jobDescription) {
        String prompt = "You are an expert ATS (Applicant Tracking System) parser and recruiter. " +
                "Analyze the following resume text. " +
                (jobDescription != null && !jobDescription.isBlank() ? "Evaluate it specifically against this job description: \n" + jobDescription + "\n\n" : "") +
                "Resume Text:\n" + resumeText + "\n\n" +
                "Return a raw JSON object containing exactly the following keys. Do not include markdown wraps or ```json indicators. " +
                "{\n" +
                "  \"skills\": [\"list\", \"of\", \"skills\"],\n" +
                "  \"education\": [\"education detail 1\", \"education detail 2\"],\n" +
                "  \"experience\": [\"experience detail 1\"],\n" +
                "  \"atsScore\": 85,\n" +
                "  \"missingKeywords\": [\"missing skill 1\", \"missing skill 2\"],\n" +
                "  \"grammarSuggestions\": \"summary of grammar fixes needed\",\n" +
                "  \"formattingSuggestions\": \"summary of formatting fixes\",\n" +
                "  \"salaryEstimate\": \"$100,000 - $120,000\",\n" +
                "  \"improvementRecommendations\": \"general tips\"\n" +
                "}";

        return geminiClient.generateText(prompt);
    }

    public Map<String, Object> calculateResumeDiff(List<String> resumeSkills, List<String> jobSkills) {
        Set<String> resumeSet = resumeSkills.stream().map(String::toLowerCase).map(String::trim).collect(Collectors.toSet());
        Set<String> jobSet = jobSkills.stream().map(String::toLowerCase).map(String::trim).collect(Collectors.toSet());

        List<String> matched = jobSkills.stream()
                .filter(s -> resumeSet.contains(s.toLowerCase().trim()))
                .collect(Collectors.toList());

        List<String> missing = jobSkills.stream()
                .filter(s -> !resumeSet.contains(s.toLowerCase().trim()))
                .collect(Collectors.toList());

        int score = jobSet.isEmpty() ? 100 : (int) Math.round(((double) matched.size() / jobSet.size()) * 100);

        Map<String, Object> result = new HashMap<>();
        result.put("matchPercentage", score);
        result.put("matchedSkills", matched);
        result.put("missingSkills", missing);
        return result;
    }
}
