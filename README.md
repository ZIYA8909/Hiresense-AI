# HireSense AI - Enterprise AI-Powered Recruitment Platform

HireSense AI is a premium, enterprise-grade AI-powered recruitment platform designed to streamline hiring workflows for recruiters, candidates, and administrators. Structured as an event-driven microservices architecture, it integrates Apache Kafka for streaming, PostgreSQL & pgvector for semantic search, Elasticsearch for fuzzy lookups, Redis for caching/rate-limiting, and isolated Docker runtimes for code sandboxes.

---

## 🏗️ System Architecture

```
                               +-------------------------------------+
                               |          Next.js Frontend           |
                               +-------------------------------------+
                                                  |
                                                  | (CORS / HTTP / WS)
                                                  v
                               +-------------------------------------+
                               |      Spring Cloud API Gateway       |
                               +-------------------------------------+
                                                  |
               +------------------+---------------+------------------+------------------+
               |                  |               |                  |                  |
               v                  v               v                  v                  v
       +--------------+   +--------------+ +--------------+   +--------------+   +--------------+
       | Auth Service |   | Recruitment  | |  AI Service  |   | Notification |   |   Sandbox    |
       |  (Port 8081) |   |  (Port 8082) | |  (Port 8083) |   |  (Port 8085) |   |  (Port 8084) |
       +--------------+   +--------------+ +--------------+   +--------------+   +--------------+
               |                  |               |                  |                  |
               v                  v               v                  v                  v
         [Redis Cache]      [PostgreSQL]   [Gemini Client]    [STOMP Broker]    [Docker Engine]
                            [pgvector]                                           (Memory/CPU)
                            [Elasticsearch]
                            [AWS S3]
```

---

## ⚡ Microservice Modules

1. **API Gateway (8080)**: Central HTTP router and CORS controller using Spring Cloud Gateway.
2. **Authentication Service (8081)**: Manages JWT credentials, OTP emails, and Redis sessions.
3. **Recruitment Service (8082)**: Manages candidate applications, S3 PDF uploads, pgvector profiles, and Elasticsearch document syncing.
4. **AI Service (8083)**: Invokes Gemini API for resume parsing, keyword matching, interview grading, and career coaching.
5. **Sandbox Service (8084)**: Spawns CPU-limited, RAM-capped (128MB), network-disabled containers (Python, Node, Java, C++) to safely run algorithms.
6. **Notification Service (8085)**: Consumes Kafka topics and broadcasts updates to specific candidates' STOMP WebSocket channels in real time.

---

## 📥 Event-Driven Data Flows (Kafka)

1. **Resume Processing Loop**:
   - Candidate uploads PDF -> Recruitment Service saves meta and publishes `RESUME_UPLOADED` to Kafka.
   - AI Service consumes `RESUME_UPLOADED`, parses the text with Gemini, computes a 1536-dim embedding vector, and publishes `RESUME_PROCESSED`.
   - Recruitment Service consumes `RESUME_PROCESSED`, saves the vector/ATS scores to PostgreSQL, and indexes the text in Elasticsearch.
2. **WebSocket Notifications Loop**:
   - Recruiter drags Sarah Connor to "Interview" -> Recruitment Service saves status and publishes `APPLICATION_STATUS_UPDATED`.
   - Notification Service consumes the event and pushes a WS STOMP alert to Sarah's private queue `/user/{email}/queue/notifications`, dynamically updating her dashboard.

---

## 🧠 Semantic Matchmaking (pgvector)

Instead of using basic text matches, HireSense AI converts resume texts and job requirement descriptions into 1536-dimensional embeddings. It queries the PostgreSQL database utilizing pgvector's cosine distance operator (`<=>`) to list matching candidate profiles:
```sql
SELECT * FROM applications a 
WHERE a.job_id = :jobId 
ORDER BY a.resume_embedding <=> CAST(:embedding AS vector) 
LIMIT 5
```

---

## 💾 Redis Caching & Invalidation Topology

We utilize Spring Boot Cache abstractions backed by Redis to optimize query speeds.

| Cache Namespace | Default TTL | Invalidation Trigger | Description |
| :--- | :--- | :--- | :--- |
| `popular_jobs` | 15 Minutes | New Job Posting / Update | Caches active job listings. Evicted on creation or update of job objects. |
| `top_companies` | 1 Hour | Verification Status Change | Caches verified enterprise profiles. Evicted when admins toggles verified badge. |
| `dashboard_analytics` | 5 Minutes | Application Drag-and-Drop | Caches recruiter funnel analytics. Evicted when candidate pipelines transition. |
| `candidate_profiles` | 10 Minutes | Profile Edit / Status Change | Caches applicant details. Evicted on candidate resume uploads or stage edits. |

---

## 🚀 Setup & Execution Guide

### Prerequisite Infrastructure
Ensure Docker Desktop is installed and running on your execution host.

### Step 1: Start Databases & Brokers
From the project root:
```bash
docker-compose up -d
```
This spawns PostgreSQL/pgvector, Redis, Elasticsearch, Kafka + Kraft, Prometheus, and Grafana.

### Step 2: Compile & Run Backend Microservices
Run the maven build from `/backend`:
```bash
mvn clean install -DskipTests
```
Launch the services:
- **API Gateway**: `java -jar api-gateway/target/api-gateway-1.0.0.jar`
- **Auth Service**: `java -jar auth-service/target/auth-service-1.0.0.jar`
- **Recruitment Service**: `java -jar recruitment-service/target/recruitment-service-1.0.0.jar`
- **AI Service**: `java -jar ai-service/target/ai-service-1.0.0.jar` (Set `GEMINI_API_KEY` env variable)
- **Sandbox Service**: `java -jar sandbox-service/target/sandbox-service-1.0.0.jar`
- **Notification Service**: `java -jar notification-service/target/notification-service-1.0.0.jar`

### Step 3: Launch Next.js Frontend
From `/frontend`:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.
Use the **"Developer Quick Login"** option to bypass server integrations and preview candidate and recruiter portals instantly.
