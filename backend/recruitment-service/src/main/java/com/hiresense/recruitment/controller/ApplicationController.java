package com.hiresense.recruitment.controller;

import com.hiresense.recruitment.model.Application;
import com.hiresense.recruitment.model.ApplicationStatus;
import com.hiresense.recruitment.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/recruitment/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping(value = "/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Application> applyForJob(
            @RequestParam Long jobId,
            @RequestParam Long candidateId,
            @RequestParam String name,
            @RequestParam String email,
            @RequestPart MultipartFile resume) {
        return ResponseEntity.ok(applicationService.applyForJob(jobId, candidateId, name, email, resume));
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<Application>> getApplicationsByCandidate(@PathVariable Long candidateId) {
        return ResponseEntity.ok(applicationService.getApplicationsByCandidate(candidateId));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getApplicationsByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id, @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }

    @PostMapping("/semantic-search")
    public ResponseEntity<List<Application>> semanticSearch(
            @RequestParam Long jobId,
            @RequestBody float[] embedding,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(applicationService.searchSemanticCandidates(jobId, embedding, limit));
    }
}
