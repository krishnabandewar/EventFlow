# ⚡ EventFlow

![EventFlow Prime](https://img.shields.io/badge/Status-Operational-success?style=for-the-badge) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)

**EventFlow** is a high-performance, distributed event ingestion and processing system. It decouples event reception from processing using a message queue architecture, allowing for massive scalability and fault tolerance.

It comes with **EventFlow Prime**, a futuristic, real-time dashboard for monitoring and injecting events.

---

## 🏗️ System Architecture

The system follows a producer-consumer pattern designed for high throughput:

1.  **Ingestion API (Producer)**: High-performance Node.js/Express API that validates requests and immediately pushes tasks to Redis. Returns `202 Accepted` instantly.
2.  **Message Broker (Redis + BullMQ)**: Reliable job queue handling backpressure, retries, and delayed jobs.
3.  **Worker Service (Consumer)**: Decoupled workers that pull jobs from the queue and simulate complex processing (DB writes, external calls).
4.  **PostgreSQL**: Persistent storage for user data and event logs.
5.  **EventFlow Prime (Client)**: A standalone, glassmorphism-styled SPA for interacting with the system.

---

## 🚀 Getting Started

### Prerequisites

*   **Docker** & **Docker Compose** installed on your machine.
*   That's it!

### Quick Start

1.  **Clone the repository**
    ```bash
    git clone https://github.com/krishnabandewar/EventFlow.git
    cd EventFlow
    ```

2.  **Spin up the Infrastructure**
    ```bash
    docker-compose up -d --build
    ```
    *This starts Postgres, Redis, the API server, and the Worker nodes.*

3.  **Run Migrations** (First time only)
    The system attempts to auto-migrate, but you can force it if needed:
    ```bash
    docker exec -it eventflow-api npm run migrate
    ```

4.  **Launch the Dashboard**
    Since the client is a static app, you can serve it with any static server.
    ```bash
    npx serve client -l 8080
    ```

---

## 🖥️ EventFlow Prime Dashboard

Access the console at: **http://localhost:8080**

The dashboard features:
*   ✨ **Sci-Fi Aesthetic**: Dark mode, glassmorphism, and neon visuals.
*   📊 **Real-Time Metrics**: Live tracking of event counts and success rates.
*   🔮 **Particle Background**: Interactive visual effects.
*   ⚡ **Event Injector**: Form to dispatch `ORDER_CREATED`, `USER_SIGNUP`, etc.

---

## 📡 API Reference

**Base URL**: `http://localhost:3000/api/v1`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Create a new account |
| `POST` | `/auth/login` | Get JWT access token |
| `POST` | `/events` | Dispatch a new event (Authenticated) |
| `GET` | `/events` | List events & statuses (Authenticated) |
| `GET` | `/health` | System health check |

### Example Payload
```json
{
  "type": "ORDER_CREATED",
  "payload": {
    "orderId": "123",
    "amount": 99.99
  }
}
```

---

## 🛠️ Tech Stack

*   **Framework**: Express.js with TypeScript
*   **Database**: PostgreSQL
*   **Queue**: BullMQ with Redis
*   **Containerization**: Docker & Docker Compose
*   **Frontend**: Vanilla JS + Tailwind CSS (Zero Build Step)

---

## 📄 License

MIT License - feel free to fork and use!
