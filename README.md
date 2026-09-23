<div align="center">

# 🏥 Nabha Telemedicine Platform

### Smart India Hackathon 2025 — Top 100 Teams at Bennett University

A full-stack, microservices-based **rural healthcare platform** built for SIH 2025 — bridging the healthcare gap in underserved rural communities through accessible digital health tools, AI-powered diagnostics, telemedicine, and secure health records.

🏆 **Ranked in the Top 100 teams out of 500+ at Bennett University**

[**▶ Live demo — full walkthrough (video)**](https://youtu.be/t-bTZ82bfmc)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?logo=tensorflow&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)

</div>

---

## 🎥 Project Demo

Watch the complete working demonstration on YouTube:

▶️ **[youtu.be/t-bTZ82bfmc](https://youtu.be/t-bTZ82bfmc)**

## 🚀 Features

| Module | Description | Port |
|---|---|---|
| **Main Platform** | Central hub connecting all features (React + Vite) | 3000 |
| **Community Chat & Forum** | Real-time chat rooms, medical Q&A, doctor-verified posts | 5050 |
| **Skin Disease Detection** | AI-powered skin disease diagnosis using CNN (TensorFlow/Keras) | 5002 |
| **Village Health Hub** | Local health resources, nearby facilities & services | 5176 |
| **Pregnancy & Period Tracker** | Cycle tracking, pregnancy milestone monitoring | 5177 |
| **Blood Donation** | Donor matching, blood bank locator | 5178 |
| **Digital Health Records** | Secure cloud-backed personal health records (Firebase) | 3002 |
| **Medicine Availability Tracker** | Real-time pharmacy stock & medicine search | 5002 |
| **Video Consultation** | Live doctor-patient video calls (ZEGOCLOUD) | 5175 |
| **Unified Backend** | Aggregated API gateway for cross-service requests | 8000 |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 (Community Chat)
- Vite + TypeScript (all other frontends)
- Tailwind CSS
- Socket.IO client (real-time chat)

**Backend**
- Node.js + Express (Chat service, Health Records)
- Python + Flask (Medicine API, Skin Disease API, Unified Backend)
- Socket.IO (real-time messaging)

**Database & Cloud**
- SQLite (Chat & community data)
- Firebase Firestore (Digital Health Records)
- MySQL (optional, supported)

**AI/ML**
- TensorFlow / Keras (CNN model for skin disease classification)
- Custom trained `.h5` model

**Integrations**
- ZEGOCLOUD (video calling)
- JWT authentication
- Role-based access (Patient / Doctor / Admin)

---

## 🏗️ Architecture

```text
                    ┌────────────────────┐
                    │   Main Platform    │
                    │     Port : 3000    │
                    └─────────┬──────────┘
                              │
        ┌──────────────┬──────┴───────┬───────────────┐
        ▼              ▼              ▼               ▼
 ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
 │  Chat API   │ │Health Records│ │ Medicine API│ │ Unified API │
 │  :5050      │ │  :3002       │ │  :5002      │ │  :8000      │
 └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

 Micro-frontends (Vite):
   :3001  Skin Disease UI        :5177  Pregnancy Tracker
   :5175  Video Calling          :5178  Blood Donation
   :5176  Village Health Hub
```

---

## 📂 Project Structure

```text
niramaya-digital-healthcare/
├── frontend/
│   └── main-web/                               # Main Niramaya frontend
├── backend/
│   ├── health-records/                         # Health records service
│   └── medicine-api/                           # Medicine and pharmacy API
├── video-consultation/
│   └── zegocloud-app/                          # Separate video application
├── archive/                                    # Retained standalone and backup projects
├── docs/
├── scripts/
└── Smart India Hackathon 2025/unified-backend/ # Legacy proxy, retained for review
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- Python 3.11+
- npm
- Git

### Installation

```bash
# Clone the repo
git clone https://github.com/shaauryaa/nabha-telemedicine-platform.git
cd nabha-telemedicine-platform

# Install active JavaScript dependencies
cd frontend/main-web && npm install && cd ../..
cd backend/health-records && npm install && cd ../..
cd video-consultation/zegocloud-app && npm install && cd ../..

# Set up Python environments
python -m venv backend/medicine-api/venv
backend/medicine-api/venv/Scripts/pip install -r backend/medicine-api/requirements.txt
pip install bcrypt PyJWT  # additional deps

python -m venv "Smart India Hackathon 2025/unified-backend/venv"
"Smart India Hackathon 2025/unified-backend/venv/Scripts/pip" install -r "Smart India Hackathon 2025/unified-backend/requirements.txt"
```

### Environment Variables

Copy the example files and fill in your credentials:

```bash
cp backend/health-records/env.example backend/health-records/.env
```

**`backend/health-records/.env`** — requires Firebase project credentials (see `env.example`).

---

## ▶️ Running the Project

Start each service in a separate terminal:

```bash
# 1. Main Website
cd frontend/main-web
npx vite --port 3000 --host

# 2. Health Records API
cd backend/health-records && node server.js

# 3. Medicine API
cd backend/medicine-api
./venv/Scripts/python app.py

# 4. Unified Backend (optional legacy proxy)
cd "Smart India Hackathon 2025/unified-backend"
./venv/Scripts/python app.py

# 5. Video Consultation
cd video-consultation/zegocloud-app
npx vite --port 5175
```

Then open **`http://localhost:3000`**

> **Windows users:** Enable Long Path support before installing TensorFlow:
> Run PowerShell as Administrator → `Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1`

---

## 🔒 Security

- JWT authentication across services
- Role-based access control (Patient / Doctor / Admin)
- Secure, cloud-backed health record storage (Firebase)
- Protected API routes
- Secure video consultations

---

## 🎯 Impact

Built to address real healthcare challenges in rural India:

- Improved healthcare accessibility for underserved communities
- AI-assisted disease detection where doctors are scarce
- Secure digital medical records
- Emergency blood donation support
- Women's health monitoring
- Real-time doctor consultations
- Community-driven health awareness

---

## 👨‍💻 Team

**Team Console** — Smart India Hackathon 2025

---

## 📜 License

Licensed under the **MIT License**.

---

<div align="center">
<sub>⭐ If you found this project useful, consider starring the repo!</sub>
</div>
