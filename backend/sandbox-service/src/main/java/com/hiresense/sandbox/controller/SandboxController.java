package com.hiresense.sandbox.controller;

import com.hiresense.sandbox.service.DockerSandboxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/sandbox")
public class SandboxController {

    @Autowired
    private DockerSandboxService sandboxService;

    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> execute(@RequestBody Map<String, String> request) {
        String language = request.get("language");
        String code = request.get("code");
        String input = request.get("input");
        String expectedOutput = request.get("expectedOutput");

        return ResponseEntity.ok(sandboxService.executeCode(language, code, input, expectedOutput));
    }
}
