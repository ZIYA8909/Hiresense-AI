package com.hiresense.ai.controller;

import com.hiresense.ai.service.AiResumeService;
import com.hiresense.ai.service.AiInterviewService;
import com.hiresense.ai.service.AiAssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Autowired
    private AiResumeService aiResumeService;

    @Autowired
    private AiInterviewService aiInterviewService;

    @Autowired
    private AiAssistantService aiAssistantService;

    @PostMapping("/resume/analyze")
    public ResponseEntity<String> analyzeResume(@RequestBody String resumeText, @RequestParam(required = false) String jobDescription) {
        return ResponseEntity.ok(aiResumeService.analyzeResume(resumeText, jobDescription));
    }

    @PostMapping("/resume/diff")
    public ResponseEntity<Map<String, Object>> calculateResumeDiff(@RequestBody Map<String, List<String>> payload) {
        List<String> resumeSkills = payload.get("resumeSkills");
        List<String> jobSkills = payload.get("jobSkills");
        return ResponseEntity.ok(aiResumeService.calculateResumeDiff(resumeSkills, jobSkills));
    }

    @PostMapping("/interview/question")
    public ResponseEntity<String> generateQuestion(
            @RequestParam String role,
            @RequestParam String type,
            @RequestParam int questionIndex) {
        return ResponseEntity.ok(aiInterviewService.generateQuestion(role, type, questionIndex));
    }

    @PostMapping("/interview/evaluate")
    public ResponseEntity<String> evaluateInterview(
            @RequestParam String role,
            @RequestBody String transcript) {
        return ResponseEntity.ok(aiInterviewService.evaluateInterview(role, transcript));
    }

    @PostMapping("/chat/coach")
    public ResponseEntity<String> chatCareerCoach(
            @RequestParam(required = false, defaultValue = "") String history,
            @RequestBody String userMessage) {
        return ResponseEntity.ok(aiAssistantService.chatCareerCoach(history, userMessage));
    }

    @PostMapping("/query-embedding")
    public ResponseEntity<float[]> queryToEmbedding(@RequestBody String query) {
        return ResponseEntity.ok(aiAssistantService.queryToEmbedding(query));
    }
}
