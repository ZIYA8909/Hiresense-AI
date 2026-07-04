package com.hiresense.recruitment.controller;

import com.hiresense.recruitment.model.Job;
import com.hiresense.recruitment.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/recruitment/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job, @RequestParam Long companyId) {
        return ResponseEntity.ok(jobService.createJob(job, companyId));
    }

    @GetMapping
    public ResponseEntity<List<Job>> getActiveJobs() {
        return ResponseEntity.ok(jobService.getActiveJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
        return ResponseEntity.ok(jobService.updateJob(id, jobDetails));
    }

    @PostMapping("/semantic-search")
    public ResponseEntity<List<Job>> semanticSearch(@RequestBody float[] embedding, @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(jobService.findSemanticJobs(embedding, limit));
    }
}
