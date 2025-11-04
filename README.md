# 🚀  Triển khai Ứng dụng với Kubernetes & Docker Compose

## 📘 Giới thiệu

Dự án này là một ứng dụng **Fullstack** được xây dựng bằng **Node.js (Backend)**, **React + Vite (Frontend)**, sử dụng **MongoDB** để lưu trữ dữ liệu và **Redis** để cache.  
Ứng dụng được đóng gói bằng **Docker Compose** cho môi trường phát triển và triển khai bằng **Kubernetes** trong môi trường production.

---

## 🛠️ Công nghệ sử dụng

| Biểu tượng | Công nghệ | Mô tả |
|-------------|------------|--------|
| 🟩 | **Node.js** | Backend API, xử lý logic và kết nối cơ sở dữ liệu |
| ⚛️ | **React + Vite** | Frontend hiện đại, tốc độ cao |
| 🍃 | **MongoDB** | Cơ sở dữ liệu NoSQL lưu trữ dữ liệu người dùng |
| 🔴 | **Redis** | Lưu cache, session và tối ưu hiệu năng |
| 🐳 | **Docker Compose** | Dùng để chạy toàn bộ ứng dụng trong môi trường dev |
| ☸️ | **Kubernetes (K8s)** | Dùng để triển khai ứng dụng ở môi trường production |
| 🧰 | **Nginx** *(tuỳ chọn)* | Reverse proxy và load balancing |

## 🐳 Chạy ứng dụng bằng Docker Compose
  ```bash
      docker-compose up --build
  ```
## ☸️ Triển khai với Kubernetes
### 1️⃣ Tạo namespace
  ```bash
      kubectl create namespace myapp
  ```
### 2️⃣ Triển khai các dịch vụ
  ```bash
    kubectl apply -f k8s/ -n myapp
  ```
### 3️⃣ Kiểm tra trạng thái
  ```bash
      kubectl get pods -n myapp
      kubectl get svc -n myapp
  ```
### 4️⃣ Truy cập qua ingress
  ```bash
    http://myapp.local
  ```
## 📈 Roadmap / Mở rộng
### 🤖 GitHub Actions CI/CD
**github/workflows/ci-cd.yml**
  ```bash
    name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install backend dependencies
        run: |
          cd backend
          npm install
          npm run build

      - name: Install frontend dependencies
        run: |
          cd frontend
          npm install
          npm run build

      - name: Docker Login
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build & Push Docker images
        run: |
          docker build -t myrepo/backend:latest ./backend
          docker build -t myrepo/frontend:latest ./frontend
          docker push myrepo/backend:latest
          docker push myrepo/frontend:latest

      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v4
        with:
          manifests: k8s/
          namespace: myapp
  ```
### 📦 Helm Chart cơ bản
  ```bash
    helm/
└── myapp/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
        ├── deployment-backend.yaml
        ├── deployment-frontend.yaml
        ├── service-backend.yaml
        ├── service-frontend.yaml
        ├── mongo-deployment.yaml
        └── redis-deployment.yaml
  ```
**Chart.yaml**
```bash
  apiVersion: v2
name: myapp
description: Helm chart for my fullstack app
version: 0.1.0
appVersion: "1.0.0"
```
**values.yaml**
```bash
    backend:
  image: myrepo/backend:latest
  replicas: 2
  port: 5000

frontend:
  image: myrepo/frontend:latest
  replicas: 2
  port: 5173

mongo:
  image: mongo:6
  port: 27017

redis:
  image: redis:7
  port: 6379
```
### 🔒 Cert-Manager (SSL tự động)
**k8s/cert-manager.yaml**
  ```bash
    apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: myapp-cert
  namespace: myapp
spec:
  secretName: myapp-tls
  issuerRef:
    name: letsencrypt
    kind: ClusterIssuer
  commonName: myapp.example.com
  dnsNames:
    - myapp.example.com
```
**tạo ClusterIssuer**
```bash
  apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: youremail@example.com
    privateKeySecretRef:
      name: letsencrypt-key
    solvers:
      - http01:
          ingress:
            class: nginx
```
**Ingress sẽ dùng secret myapp-tls để bật HTTPS.**
