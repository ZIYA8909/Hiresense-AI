package com.hiresense.recruitment.repository;

import com.hiresense.recruitment.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByJobId(Long jobId);
    
    @Query(value = "SELECT * FROM applications a WHERE a.job_id = :jobId ORDER BY a.resume_embedding <=> CAST(:embedding AS vector) LIMIT :limit", nativeQuery = true)
    List<Application> findTopCandidatesBySemanticMatch(@Param("jobId") Long jobId, @Param("embedding") String embedding, @Param("limit") int limit);
}
