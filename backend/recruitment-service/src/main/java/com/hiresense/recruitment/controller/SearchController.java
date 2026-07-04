package com.hiresense.recruitment.controller;

import com.hiresense.recruitment.model.elasticsearch.JobDoc;
import com.hiresense.recruitment.model.elasticsearch.CandidateDoc;
import com.hiresense.recruitment.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/recruitment/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDoc>> searchJobs(@RequestParam String query) {
        return ResponseEntity.ok(searchService.searchJobs(query));
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<CandidateDoc>> searchCandidates(@RequestParam String query) {
        return ResponseEntity.ok(searchService.searchCandidates(query));
    }
}
