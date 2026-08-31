hey kanishk
# Academia-Industry Collaboration Portal

**Smart India Hackathon 2024** - Ministry of Ayush / All India Institute of Ayurveda

A centralized platform bridging the gap between academic institutions and industries, enabling skill assessment, personalized skill gap analysis, internship and job matching, faculty development programs, collaboration facilitation, and data-driven analytics.

## 🏗️ Architecture

This is a **monorepo** containing three services:

- **Backend** (`backend/`) - Node.js + Express + TypeScript + MongoDB
- **AI Service** (`ai-service/`) - Python + FastAPI + Machine Learning
- **Frontend** (`frontend/`) - React + Vite + TypeScript + Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Python >= 3.11
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd academia-industry-portal
   ```

2. **Install dependencies**
   ```bash
   # Install root and workspace dependencies
   npm install
   
   # Install Python dependencies
   cd ai-service
   pip install -r requirements.txt
   cd ..
   ```

3. **Configure environment variables**
   ```bash
   # Copy example files
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp ai-service/.env.example ai-service/.env
   cp frontend/.env.example frontend/.env
   
   # Edit .env files with your configuration
   ```

4. **Start services**
   ```bash
   # Terminal 1: Backend
   npm run dev:backend
   
   # Terminal 2: AI Service
   npm run dev:ai
   
   # Terminal 3: Frontend
   npm run dev:frontend
   ```

## 📁 Project Structure

```
academia-industry-portal/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Database and service configuration
│   │   ├── types/          # TypeScript types and API envelope
│   │   └── index.ts        # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── ai-service/             # Python + FastAPI AI service
│   ├── main.py            # Entry point
│   ├── requirements.txt
│   └── pytest.ini
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── package.json           # Root package.json (workspaces)
├── .env.example          # Shared environment variables
└── README.md
```

## 🔌 API Endpoints

### Backend (Port 5000)
- `GET /` - API information
- `GET /health` - Health check

### AI Service (Port 8000)
- `GET /` - Service information
- `GET /health` - Health check

### Frontend (Port 5173)
- Development server with HMR

## 🧪 Testing

```bash
# Backend tests (Jest + fast-check)
npm run test:backend

# AI Service tests (pytest + Hypothesis)
npm run test:ai

# Frontend tests (Vitest)
npm run test:frontend
```

## 📋 API Response Envelope

All API responses follow this consistent structure:

```typescript
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}

// Error
{
  "success": false,
  "message": "Error message",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

## 🛠️ Development Scripts

### Root Level
- `npm run dev:backend` - Start backend in development mode
- `npm run dev:ai` - Start AI service in development mode
- `npm run dev:frontend` - Start frontend in development mode
- `npm run test:backend` - Run backend tests
- `npm run test:ai` - Run AI service tests
- `npm run test:frontend` - Run frontend tests

### Backend
- `npm run dev` - Development with hot reload
- `npm run build` - Build TypeScript
- `npm run test` - Run Jest tests
- `npm run lint` - Lint code

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run test` - Run Vitest tests
- `npm run lint` - Lint code

## 🔒 Security Features

- Helmet middleware for secure HTTP headers
- CORS configuration
- Rate limiting on authentication endpoints
- JWT-based authentication
- bcrypt password hashing
- Environment variable protection

## 📊 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT + bcrypt
- **Testing**: Jest + Supertest + fast-check
- **Security**: Helmet, CORS, express-rate-limit

### AI Service
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Database**: MongoDB (pymongo)
- **ML Libraries**: spaCy, scikit-learn, numpy
- **Testing**: pytest + Hypothesis

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

## 👥 User Roles

The platform supports five distinct roles:

1. **Student** - Skill assessment, internships, job applications
2. **Academician** - FDPs, industrial training, research collaboration
3. **Industry_Partner** - Post opportunities, recruitment management
4. **Institution_Admin** - Analytics, monitoring, student progress
5. **Platform_Admin** - User management, verifications, system configuration

## 📖 Documentation

For detailed requirements, design, and implementation tasks, see:
- `.kiro/specs/academia-industry-portal/requirements.md`
- `.kiro/specs/academia-industry-portal/design.md`
- `.kiro/specs/academia-industry-portal/tasks.md`

## 🤝 Contributing

This project follows the Smart India Hackathon guidelines. For contribution guidelines, please refer to the team documentation.

## 📄 License

MIT License - see LICENSE file for details
Myank naruka