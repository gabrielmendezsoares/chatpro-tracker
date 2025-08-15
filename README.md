# 👁️ ChatPro Watcher

## 📋 Overview

This service is a dedicated monitoring and recovery layer for ChatPro and its deployed instances. It actively observes instance-level behavior, checks for availability and responsiveness, and takes automated action when issues are detected — such as reloading failed instances.

Designed for reliability and extensibility, the system operates continuously, ensuring that ChatPro environments remain healthy, responsive, and self-correcting. It also surfaces meaningful signals about ongoing issues, giving operators clear visibility into the system's state without requiring constant manual oversight.

### 🎯 Objectives

- Monitor the health and status of ChatPro and all active instances
- Detect crashes, hangs, or degraded performance in real time
- Automatically reload or restart failed instances to ensure uptime
- Surface and log detailed insights about recurring or critical issues
- Provide integration points for alerts, dashboards, or external tools
- Support modular deployment in diverse environments
- Minimize manual intervention through automated recovery workflows

--- 

## 📦 Quick Start

### ⚠️ Prerequisites 

- **Node.js** ≥ `20.14.0` — _JavaScript runtime environment_
- **MySQL** ≥ `8.0` — _Relational database_

### ⚙️ Setup 

```bash 
# Clone & navigate
git clone <repository-url> && cd chatpro-watcher

# Configure environment
cp .env.example .env  # Edit with your settings

# Install dependencies (auto-runs database setup)
npm install
```

> **💡 Database:** Import `storage.sql.example` before running `npm install`

---

## ⚡ Usage

### 🛠️ Development

```bash
npm run start:development
```

### 🏗️ Production

```bash
npm run build && npm run start:production
```

---

## 📚 Command Reference

### 🧰 Core

| Command | Description |
| ------- | ----------- |
| `npm run start:development` | _Start the application in development_ |
| `npm run start:production` | _Start the application in production_ |
| `npm run build` | _Build the application for production_ |
| `npm run build:watch` | _Build the application with watch mode_ |
| `npm run clean` | _Clean application build artifacts_ |

### 🛢️ Database

| Command | Description |
| ------- | ----------- |
| `npm run db:pull` | _Pull database schema into Prisma across all schemas_ |
| `npm run db:push` | _Push Prisma schema to the database across all schemas_ |
| `npm run db:generate` | _Generate Prisma Client for all schemas_ |
| `npm run db:migrate:dev` | _Run development migrations across all schemas_ |
| `npm run db:migrate:deploy` | _Deploy migrations to production across all schemas_ |
| `npm run db:studio` | _Open Prisma Studio (GUI) across all schemas_ |
| `npm run db:reset` | _Reset database (pull + generate) for all schemas_ |

### 🐳 Docker

| Command | Description |
| ------- | ----------- |
| `npm run docker:build:development` | _Build Docker image for development_ |
| `npm run docker:build:production` | _Build Docker image for production_ |
| `npm run docker:run:development` | _Run development Docker container_ |
| `npm run docker:run:production` | _Run production Docker container_ |
| `npm run docker:compose:up:development` | _Start Docker Compose in development_ |
| `npm run docker:compose:up:production` | _Start Docker Compose in production_ |
| `npm run docker:compose:up:build:development` | _Start & rebuild Docker Compose in development_ |
| `npm run docker:compose:up:build:production` | _Start & rebuild Docker Compose in production_ |
| `npm run docker:compose:down` | _Stop Docker Compose services_ |
| `npm run docker:compose:logs` | _View Docker Compose logs_ |
| `npm run docker:prune` | _Clean up unused Docker resources_ |

### 🧪 Testing

| Command | Description |
| ------- | ----------- |
| `npm test` | _Run all tests once_ |
| `npm run test:watch` | _Run tests in watch mode_ |
| `npm run test:coverage` | _Run tests and generate a coverage report_ |
  