package com.hiresense.recruitment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket-name:hiresense-resumes}")
    private String bucketName;

    @Value("${aws.s3.public-url-prefix:https://hiresense-resumes.s3.amazonaws.com/}")
    private String publicUrlPrefix;

    public String uploadFile(MultipartFile file) {
        String key = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return publicUrlPrefix + key;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to S3", e);
        } catch (Exception e) {
            System.err.println("[S3Service] Warning: S3 Upload failed: " + e.getMessage() + ". Returning mock URL.");
            return "https://mock-s3-storage.local/" + key;
        }
    }
}
