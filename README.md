# Law-Mate: AI-Powered LegalTech SaaS Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.17+-green.svg)](https://mongodb.com/)

> **A comprehensive LegalTech SaaS platform designed for law firms, independent lawyers, and clients to manage cases, documents, appointments, and legal consultations with AI-powered assistance.**

## 🚀 Overview

Law-Mate is a robust, enterprise-ready LegalTech platform that combines traditional legal practice management with cutting-edge AI technology. Built with modern web technologies, it provides secure document management, AI-powered legal research, comprehensive case tracking, and seamless client-attorney communication.

### ✨ Key Features

- **🤖 AI-Powered Legal Assistant** - RAG + LLM integration for legal research and contract analysis
- **📁 Secure Document Vault** - AWS S3 integration with e-signature support (Dropbox Sign, DocuSign)
- **⚖️ Case Management** - Complete case lifecycle from intake to closure
- **📅 Smart Scheduling** - Real-time appointment booking with calendar integration
- **💰 Billing & Time Tracking** - Comprehensive billing system with time entry tracking
- **🔐 Role-Based Access Control** - Multi-tenant architecture with granular permissions
- **📊 Audit Trails** - Complete activity logging for compliance and security
- **💬 Real-time Communication** - Socket.IO powered chat and notifications
- **🌐 Cloud-Native** - AWS deployment with CI/CD via GitHub Actions

## 🏗️ Architecture

### Tech Stack

#### Frontend

- **React 19.1.0** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **Zustand** - Lightweight state management
- **Socket.IO Client** - Real-time communication

#### Backend

- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **MongoDB 6.17.0** - NoSQL database with Mongoose ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Stateless authentication
- **Passport.js** - OAuth2 authentication (Google)
- **Multer + Multer-S3** - File upload handling
- **Stripe** - Payment processing
- **Nodemailer** - Email services

#### Infrastructure

- **AWS S3** - Document storage
- **AWS EC2** - Application hosting
- **GitHub Actions** - CI/CD pipeline
- **MongoDB Atlas** - Managed database service

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │   Express API   │    │   MongoDB       │
│                 │◄──►│                 │◄──►│                 │
│  - Components   │    │  - Controllers  │    │  - Collections  │
│  - State Mgmt   │    │  - Middleware   │    │  - Indexes      │
│  - Routing      │    │  - Routes       │    │  - Validation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Socket.IO     │    │   AWS S3        │    │   External      │
│   Real-time     │    │   Document      │    │   Services      │
│   Chat          │    │   Storage       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Core Features

### 1. AI-Powered Legal Assistant

The platform features an intelligent legal assistant that combines:

- **RAG (Retrieval-Augmented Generation)** for context-aware responses
- **LLM Integration** for natural language processing
- **Document Analysis** - PDF parsing and summarization
- **Legal Research** - Case law and statute references
- **Contract Analysis** - Automated contract review and insights

```javascript
// Chat interface with AI capabilities
const [mode, setMode] = useState("qa"); // "qa" or "summarize"
const [selectedFile, setSelectedFile] = useState(null);

// Supports both Q&A and document summarization modes
```

you can find the code to Legal Assistant at my profile

### 2. Document Management System

#### Features

- **Secure Storage** - AWS S3 integration with encryption
- **Version Control** - Document versioning and history
- **E-Signature Support** - Dropbox Sign and DocuSign integration
- **File Organization** - Tagging, categorization, and search
- **Access Control** - Role-based document permissions

#### Document Model

```javascript
const DocumentSchema = {
  title: String,
  fileKey: String, // S3 key
  fileUrl: String, // Public URL
  signedFileKey: String, // Signed version
  esignStatus: String, // pending, signed, declined
  version: Number,
  tags: [String],
  case: ObjectId, // Associated case
  uploadedBy: ObjectId, // User who uploaded
};
```

### 3. Case Management

#### Case Lifecycle

- **Intake** - Client case submission and initial assessment
- **Assignment** - Staff allocation and task distribution
- **Progress Tracking** - Status updates and milestone tracking
- **Document Management** - Case-related document organization
- **Timeline** - Complete case history and activity log

#### Case Model

```javascript
const CaseSchema = {
  title: String,
  description: String,
  status: String, // open, in-progress, closed
  client: ObjectId, // Client reference
  assignedStaff: [ObjectId], // Staff members
  documents: [ObjectId], // Related documents
  tasks: [ObjectId], // Associated tasks
  tags: [String],
};
```

### 4. User Management & RBAC

#### User Roles

- **Admin** - Full system access and user management
- **Lawyer** - Case management, document access, client communication
- **Paralegal** - Case support, document preparation, research
- **Client** - Case viewing, document access, appointment booking

#### Permission System

```javascript
// Role-based middleware
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.userId || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}
```

### 5. Appointment & Scheduling

#### Features

- **Real-time Booking** - Client self-service appointment scheduling
- **Calendar Integration** - Google Calendar sync
- **Availability Management** - Staff availability settings
- **Reminders** - Automated email and SMS notifications
- **Conflict Resolution** - Smart scheduling to avoid conflicts

### 6. Billing & Time Tracking

#### Time Tracking

- **Start/Stop Timer** - Real-time time tracking
- **Activity Categorization** - Research, drafting, court, meetings
- **Billable Hours** - Configurable billing rates
- **Time Reports** - Detailed time analysis and reporting

#### Billing System

- **Invoice Generation** - Automated invoice creation
- **Payment Processing** - Stripe integration
- **Subscription Management** - Recurring billing plans
- **Payment History** - Complete transaction records

### 7. Communication & Collaboration

#### Real-time Features

- **Live Chat** - Client-attorney communication
- **File Sharing** - Secure document exchange
- **Notifications** - Real-time updates and alerts
- **Message History** - Complete conversation logs

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB** 6.17+
- **AWS Account** (for S3 and EC2)
- **Stripe Account** (for payments)
- **Google OAuth2** (for authentication)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/law-mate.git
cd law-mate
```

#### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

#### 3. Environment Configuration

Create `.env` files in both `client/` and `server/` directories:

**Server Environment Variables**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/lawmate
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/lawmate

# Authentication
JWT_SIGNING_KEY=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-s3-bucket-name

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Server
PORT=5000
NODE_ENV=development
```

**Client Environment Variables**

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
VITE_SOCKET_URL=http://localhost:5000
```

#### 4. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# The application will automatically create collections on first run
```

#### 5. Start Development Servers

```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start frontend development server
cd client
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## 🏗️ Project Structure

```
law-mate/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── ui/                # Base UI components (Radix UI)
│   │   │   └── common/            # Shared components
│   │   ├── pages/                 # Main page components
│   │   ├── services/              # API service functions
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── stores/                # Zustand state management
│   │   └── config/                # Configuration files
│   ├── public/                    # Static assets
│   └── package.json               # Frontend dependencies
├── server/                         # Node.js backend application
│   ├── src/                       # Server source code
│   ├── controllers/               # Request handlers
│   ├── models/                    # MongoDB schemas
│   ├── routes/                    # API route definitions
│   ├── middleware/                # Express middleware
│   ├── config/                    # Configuration files
│   ├── services/                  # Business logic services
│   └── package.json               # Backend dependencies
├── shared/                        # Shared utilities and types
└── README.md                      # This file
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/refresh` - Token refresh

### Cases

- `GET /api/cases` - List all cases
- `POST /api/cases` - Create new case
- `GET /api/cases/:id` - Get case details
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Documents

- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document
- `GET /api/documents/:id` - Get document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/sign` - Initiate e-signature

### Users

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Appointments

- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Tasks

- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Time Tracking

- `GET /api/track-time` - List time entries
- `POST /api/track-time` - Create time entry
- `PUT /api/track-time/:id` - Update time entry
- `DELETE /api/track-time/:id` - Delete time entry

## 🔐 Security Features

### Authentication & Authorization

- **JWT Tokens** - Stateless authentication with refresh tokens
- **OAuth2 Integration** - Google authentication support
- **Role-Based Access Control** - Granular permission system
- **Session Management** - Secure session handling

### Data Protection

- **Input Sanitization** - XSS and injection protection
- **Rate Limiting** - API abuse prevention
- **Audit Logging** - Complete activity tracking
- **Data Encryption** - Sensitive data protection

### Infrastructure Security

- **HTTPS Only** - Secure communication
- **CORS Configuration** - Cross-origin request control
- **Environment Variables** - Secure configuration management
- **AWS IAM** - Least privilege access

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality checks

**Built with ❤️ for the legal community**

_Law-Mate - Empowering legal professionals with AI-driven technology_
