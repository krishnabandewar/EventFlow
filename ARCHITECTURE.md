# EventFlow - System Architecture & Design

## 1. High-Level Architecture

EventFlow follows a **Distributed Event-Driven Architecture** designed for high scalability, fault tolerance, and asynchronous processing.

### Architecture Components
1.  **Client/External Systems**: Initiate HTTP requests (orders, analytics) via REST API.
2.  **Load Balancer (AWS ALB / Nginx)**: Distributes incoming traffic across API instances (simulated via Docker for dev).
3.  **API Service (Event Ingestion)**:
    *   **Node.js/Express**: Handles REST endpoints.
    *   **Role**: Validates requests, authenticates users (JWT), and publishes events to Redis.
    *   **Non-Blocking**: Acknowledges receipt immediately (HTTP 202 Accepted) for async operations, significantly increasing throughput.
4.  **Message Broker (Redis)**:
    *   Acts as a robust message queue and caching layer.
    *   **BullMQ**: Manages job queues (Standard & DLQ) with reliable processing guarantees.
5.  **Worker Service (Event Processor)**:
    *   **Node.js/BullMQ Worker**: Decoupled service running purely to process background jobs.
    *   **Horizontal Scaling**: Can be scaled independently of the API service based on queue lag.
    *   **Resiliency**: Handles retries and exponential backoff automatically.
6.  **Primary Database (PostgreSQL)**:
    *   Stores persistent data (Users, Events, processing status).
    *   Indexed for frequent query patterns.
7.  **Dead Letter Queue (DLQ)**:
    *   Captures jobs that fail after max retries for manual inspection.

---

## 2. Database Schema Design (PostgreSQL)

### `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, unique | User ID |
| `email` | VARCHAR | Unique, Not Null | User Email |
| `password_hash` | VARCHAR | Not Null | Hashed password |
| `role` | VARCHAR | Default 'user' | RBAC (user/admin) |
| `created_at` | TIMESTAMP | Default NOW() | |

### `events`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, unique | Event ID (Idempotency Key) |
| `user_id` | UUID | FK -> users.id | Who triggered the event |
| `type` | VARCHAR | Not Null | Event Type (ORDER_CREATED, etc) |
| `payload` | JSONB | Not Null | The event data |
| `status` | ENUM | PENDING, PROCESSED, FAILED | Processing status |
| `created_at` | TIMESTAMP | Default NOW() | Ingestion time |
| `processed_at` | TIMESTAMP | Nullable | Completion time |

*Indexes*: `events(user_id)`, `events(status)`, `events(created_at)`

---

## 3. API Contract Documentation

### Base URL: `/api/v1`

### Authentication
*   **POST** `/auth/register`: Register new user.
*   **POST** `/auth/login`: Login and receive JWT.

### Events
*   **POST** `/events` (Protected)
    *   **Body**: `{ "type": "ORDER_CREATED", "payload": { ... } }`
    *   **Response**: `202 Accepted`, `{ "eventId": "...", "status": "queued" }`
    *   **Description**: Ingests event into Redis Queue.

*   **GET** `/events/:id` (Protected)
    *   **Response**: `200 OK`, `{ "id": "...", "status": "PROCESSED", "result": ... }`
    *   **Description**: Check status of async job.

*   **GET** `/events` (Protected)
    *   **Query**: `page`, `limit`.
    *   **Response**: Paginated list of events.

### System
*   **GET** `/health`: Status of API.

---

## 4. Deployment Checklist (AWS EC2)

1.  **Infrastructure Setup**:
    *   Launch EC2 instance (Ubuntu 22.04 LTS).
    *   Install Docker & Docker Compose.
    *   Set up Security Groups (Allow 80/443, SSH, restrict DB ports).
2.  **Environment Configuration**:
    *   Create `.env` file with production secrets.
    *   Set `NODE_ENV=production`.
3.  **Database**:
    *   Use AWS RDS for PostgreSQL (Production) or manage Postgres container with persistent volumes.
    *   Run migrations: `npm run migrate`.
4.  **Application**:
    *   Build Docker images: `docker-compose build`.
    *   Start services: `docker-compose up -d`.
5.  **Monitoring**:
    *   Set up CloudWatch logs or ELK stack.
    *   Monitor Redis memory and CPU usage.

---

## 5. Resume & Interview Talking Points

*   **Distributed Systems**: "Designed an asynchronous event ingestion system using **Redis** and **BullMQ**, decoupling high-throughput writes from heavier processing logic."
*   **Scalability**: "Implemented a worker-queue pattern allowing independent scaling of the ingestion API and background consumers."
*   **Fault Tolerance**: "Engineered robustness with **Exponential Backoff** strategies and **Dead Letter Queues (DLQ)** to handle transient failures without data loss."
*   **Database Optimization**: "Optimized PostgreSQL schema with JSONB columns for flexible payloads and targeted indexing for query performance."
*   **Clean Architecture**: "Adhered to Separation of Concerns (SoC) with a modular service-based folder structure and TypeScript for type safety."
