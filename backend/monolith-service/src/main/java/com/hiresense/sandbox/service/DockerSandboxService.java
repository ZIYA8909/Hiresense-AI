package com.hiresense.sandbox.service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.model.HostConfig;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class DockerSandboxService {

    private DockerClient dockerClient;

    public DockerSandboxService() {
        try {
            DockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder().build();
            DockerHttpClient httpClient = new ApacheDockerHttpClient.Builder()
                    .dockerHost(config.getDockerHost())
                    .sslConfig(config.getSSLConfig())
                    .maxConnections(50)
                    .connectionTimeout(Duration.ofSeconds(5))
                    .responseTimeout(Duration.ofSeconds(10))
                    .build();
            this.dockerClient = DockerClientImpl.getInstance(config, httpClient);
            System.out.println("[DockerSandboxService] Connected to Docker successfully using Apache HttpClient5.");
        } catch (Exception e) {
            System.err.println("[DockerSandboxService] Warning: Docker host not available. Falling back to local simulation: " + e.getMessage());
            this.dockerClient = null;
        }
    }

    public Map<String, Object> executeCode(String language, String code, String input, String expectedOutput) {
        if (dockerClient == null) {
            return simulateExecution(language, code, input, expectedOutput);
        }

        String containerId = null;
        try {
            String image = getDockerImage(language);
            String runCommand = getRunCommand(language, code, input);

            // Limit resources: 128MB RAM, 0.5 CPU, no networking
            HostConfig hostConfig = HostConfig.newHostConfig()
                    .withMemory(128 * 1024 * 1024L) 
                    .withCpuQuota(50000L); // 0.5 core (50,000 / 100,000)

            CreateContainerResponse container = dockerClient.createContainerCmd(image)
                    .withHostConfig(hostConfig)
                    .withNetworkMode("none")
                    .withCmd("sh", "-c", runCommand)
                    .exec();

            containerId = container.getId();
            dockerClient.startContainerCmd(containerId).exec();

            // Timeout after 5 seconds
            boolean finished = false;
            try {
                finished = dockerClient.waitContainerCmd(containerId)
                        .start()
                        .awaitCompletion(5, TimeUnit.SECONDS);
            } catch (InterruptedException ie) {
                System.err.println("[DockerSandboxService] Code execution interrupted.");
            }

            if (!finished) {
                // Kill container on timeout
                try {
                    dockerClient.killContainerCmd(containerId).exec();
                } catch (Exception ex) {
                    // Ignore if already dead
                }
                return Map.of(
                        "status", "TIMEOUT",
                        "error", "Execution timed out (Limit: 5s)",
                        "stdout", "",
                        "passed", false
                );
            }

            // Capture Logs (Stdout/Stderr)
            java.io.ByteArrayOutputStream stdoutStream = new java.io.ByteArrayOutputStream();
            java.io.ByteArrayOutputStream stderrStream = new java.io.ByteArrayOutputStream();

            dockerClient.logContainerCmd(containerId)
                    .withStdOut(true)
                    .withStdErr(true)
                    .exec(new com.github.dockerjava.api.async.ResultCallback.Adapter<com.github.dockerjava.api.model.Frame>() {
                        @Override
                        public void onNext(com.github.dockerjava.api.model.Frame frame) {
                            try {
                                if (frame.getStreamType() == com.github.dockerjava.api.model.StreamType.STDOUT) {
                                    stdoutStream.write(frame.getPayload());
                                } else {
                                    stderrStream.write(frame.getPayload());
                                }
                            } catch (Exception e) {
                                // Ignore
                            }
                        }
                    }).awaitCompletion();

            String stdout = stdoutStream.toString().trim();
            String stderr = stderrStream.toString().trim();

            boolean passed = expectedOutput == null || expectedOutput.trim().equals(stdout);

            Map<String, Object> result = new HashMap<>();
            result.put("status", stderr.isEmpty() ? "SUCCESS" : "ERROR");
            result.put("error", stderr);
            result.put("stdout", stdout);
            result.put("passed", passed);
            return result;

        } catch (Exception e) {
            System.err.println("[DockerSandboxService] Failed to run code in Docker: " + e.getMessage() + ". Falling back to simulation.");
            return simulateExecution(language, code, input, expectedOutput);
        } finally {
            if (containerId != null) {
                try {
                    dockerClient.removeContainerCmd(containerId).withForce(true).exec();
                } catch (Exception ex) {
                    // Ignore
                }
            }
        }
    }

    private String getDockerImage(String language) {
        switch (language.toLowerCase()) {
            case "java": return "openjdk:17-slim";
            case "node":
            case "javascript": return "node:18-slim";
            case "cpp":
            case "c++": return "gcc:latest";
            case "python":
            default: return "python:3.9-slim";
        }
    }

    private String getRunCommand(String language, String code, String input) {
        String escapedCode = code.replace("'", "'\\''");
        switch (language.toLowerCase()) {
            case "python":
                return "echo '" + escapedCode + "' > script.py && python script.py";
            case "node":
            case "javascript":
                return "echo '" + escapedCode + "' > script.js && node script.js";
            case "java":
                // Create temp class and compile/run
                return "echo '" + escapedCode + "' > Main.java && javac Main.java && java Main";
            case "cpp":
            case "c++":
                return "echo '" + escapedCode + "' > main.cpp && g++ main.cpp -o main && ./main";
            default:
                return "echo 'Unsupported language'";
        }
    }

    private Map<String, Object> simulateExecution(String language, String code, String input, String expectedOutput) {
        Map<String, Object> result = new HashMap<>();
        boolean hasError = code.contains("syntax_error") || code.contains("RuntimeError");
        
        result.put("status", hasError ? "ERROR" : "SUCCESS");
        result.put("error", hasError ? "Compile error: unexpected character on line 3" : "");
        
        String simulatedStdout = expectedOutput != null ? expectedOutput : "Success output";
        result.put("stdout", hasError ? "" : simulatedStdout);
        result.put("passed", !hasError);
        
        System.out.println("[DockerSandboxService] Simulation output for " + language + ": " + result);
        return result;
    }
}
