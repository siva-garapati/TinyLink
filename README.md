# 🔗 TinyLink — Modern URL Shortener

TinyLink is a clean and fast open-source URL shortener built with **Next.js App Router**, **Prisma**, **PostgreSQL**, and **Tailwind CSS**.
 
Create short memorable links, track clicks, view stats, and manage everything from a beautiful dashboard.

Live Demo → *(add URL here)*  
Backend Status → */healthz*

---

## 🚀 Features

### Core Features
- 🔗 Create short links in seconds  
- ✏️ Custom short codes (6–8 alphanumeric)  
- 🎯 Auto-generated unique codes  
- 📊 Click tracking  
- 🕒 “Last clicked” relative time (e.g., *2 hours ago*)  
- 📅 Link creation date  
- ❌ Delete links  
- 🎨 Beautiful dashboard UI  
- 🍞 Toast notifications (Sonner)

### API
- `POST /api/links` — Create new short link  
- `GET /api/links` — Fetch all links  
- `GET /api/links/:code` — Fetch a specific link  
- `DELETE /api/links/:code` — Delete  
- `GET /healthz` — Fast health check

---

## 🛠 Tech Stack

- **Next.js 14** (App Router, Server + Client mixed rendering)  
- **Prisma ORM**  
- **PostgreSQL**  
- **Tailwind CSS v4**  
- **Lucide Icons**  
- **Sonner Toast Library**  
- **Vercel Deployment Ready**

---

## 📦 Installation

```bash
git clone https://github.com/siva-garapati/tinylink.git
cd tinylink
npm install