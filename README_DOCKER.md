# 🐳 Sudur Chinari Frontend - Docker Deployment Guide

This repository contains the Next.js 16 (App Router + React 19 + Tailwind CSS) frontend for Sudur Chinari, containerized with a lightweight multi-stage standalone build (~150MB).

---

## 🚀 Quick Start

### 1. Copy Environment Variables
```bash
cp .env.example .env
nano .env
```

**Key configurations:**
- `DJANGO_API_URL`:
  - If backend is on the **same VPS**: `http://sudur_backend:8000` (uses shared Docker network `sudur_network`).
  - If backend is on a **separate VPS / domain**: `https://api.yourdomain.com` (or `http://<backend-vps-ip>:8000`).
- `NEXT_PUBLIC_API_URL`: `/api/v1` (browser requests are proxied automatically) or your full backend API URL.
- `NEXT_PUBLIC_SITE_URL`: `https://yourdomain.com`.

### 2. Build & Start the Container
```bash
docker compose up -d --build
```

### 3. Check Logs
```bash
docker compose logs -f frontend
```

The frontend will be live at `http://<vps-ip>:3000`!

---

## 🔗 Connecting with Backend

### Case A: Backend and Frontend on the SAME VPS
1. Run backend first:
   ```bash
   cd ../Sudur-Chinari-Backend
   docker compose up -d --build
   ```
2. Run frontend:
   ```bash
   cd ../Sudur-Chinari-Frontend
   docker compose up -d --build
   ```
Both containers join `sudur_network`, allowing the frontend to communicate with `http://sudur_backend:8000` without exposing the backend to the public internet if you prefer.

### Case B: Backend and Frontend on SEPARATE VPSes
1. In `Sudur-Chinari-Frontend/.env`, point to the backend domain or public IP:
   ```ini
   DJANGO_API_URL=https://api.yourdomain.com
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```
2. Run `docker compose up -d --build`.

---

## 🔒 Production Reverse Proxy (Nginx / Caddy / Cloudflare)

To bind the frontend on port 80/443 with an SSL certificate, you can configure a standard Nginx reverse proxy on the host:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```
