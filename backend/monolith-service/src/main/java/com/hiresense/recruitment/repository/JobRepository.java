package com.hiresense.recruitment.repository;

import com.hiresense.recruitment.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    @Query(value = "SELECT * FROM jobs j WHERE j.status = 'ACTIVE' ORDER BY j.job_embedding <=> CAST(:embedding AS vector) LIMIT :limit", nativeQuery = true)
    List<Job> findTopJobsBySemanticMatch(@Param("embedding") String embedding, @Param("limit") int limit);

    List<Job> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrRequirementsContainingIgnoreCase(String title, String description, String requirements);
}
