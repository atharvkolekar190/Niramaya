# Healthcare Records Management System - Backend API

A secure Node.js backend API for managing healthcare records with Firebase Firestore database, featuring patient and doctor authentication, health record management, and access control.

## 🏗️ Architecture

- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: JWT tokens
- **File Storage**: Local filesystem (configurable)
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Joi

## 📊 Database Schema

### Patients Collection
| Field | Type | Description |
|-------|------|-------------|
| patient_id | String | Unique identifier |
| name | String | Patient's full name |
| email | String | Email address (unique) |
| phone | String | Phone number |
| age | Number | Age in years |
| gender | String | male/female/other |
| address | String | Physical address |
| password | String | Hashed password |
| created_at | Date | Creation timestamp |
| updated_at | Date | Last update timestamp |

### Doctors Collection
| Field | Type | Description |
|-------|------|-------------|
| doctor_id | String | Unique identifier |
| name | String | Doctor's full name |
| email | String | Email address (unique) |
| specialization | String | Medical specialization |
| hospital | String | Hospital name |
| contact | String | Contact number |
| license_number | String | Medical license number |
| password | String | Hashed password |
| created_at | Date | Creation timestamp |
| updated_at | Date | Last update timestamp |

### Health_Records Collection
| Field | Type | Description |
|-------|------|-------------|
| record_id | String | Unique identifier |
| patient_id | String | Reference to patient |
| uploaded_by | String | Doctor or patient ID who uploaded |
| file_url | String | Path to uploaded file |
| file_name | String | Original filename |
| file_type | String | MIME type |
| file_size | Number | File size in bytes |
| notes | String | Additional notes |
| encrypted | Boolean | Whether file is encrypted |
| date | Date | Record date |
| created_at | Date | Creation timestamp |
| updated_at | Date | Last update timestamp |

### Access_Control Collection
| Field | Type | Description |
|-------|------|-------------|
| access_id | String | Unique identifier |
| patient_id | String | Reference to patient |
| doctor_id | String | Reference to doctor |
| access_granted | Boolean | Whether access is granted |
| granted_at | Date | When access was granted |
| revoked_at | Date | When access was revoked |
| expires_at | Date | When access expires |
| permissions | Array | Array of permissions (read, write, delete) |
| created_at | Date | Creation timestamp |
| updated_at | Date | Last update timestamp |

## 🚀 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/login` | Login and get JWT token | Public |
| POST | `/api/auth/patient/register` | Register new patient | Public |
| POST | `/api/auth/doctor/register` | Register new doctor | Public |
| GET | `/api/auth/profile` | Get current user profile | Protected |
| PUT | `/api/auth/profile` | Update user profile | Protected |
| PUT | `/api/auth/change-password` | Change password | Protected |

### Health Records Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/records/upload` | Upload health record | Doctor/Patient |
| GET | `/api/records/:patient_id` | Get patient records | Doctor/Patient (with access) |
| GET | `/api/records/record/:record_id` | Get specific record | Doctor/Patient |
| GET | `/api/records/download/:record_id` | Download record file | Doctor/Patient |
| PUT | `/api/records/:record_id` | Update record notes | Doctor/Patient |
| DELETE | `/api/records/:record_id` | Delete record | Doctor/Patient |
| GET | `/api/records/:patient_id/date-range` | Get records by date range | Doctor/Patient (with access) |

### Access Control Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/access/grant` | Grant doctor access | Patient only |
| POST | `/api/access/revoke` | Revoke doctor access | Patient only |
| GET | `/api/access/patient/:patient_id` | Get patient's access controls | Patient/Doctor |
| GET | `/api/access/doctor` | Get doctor's access controls | Doctor only |
| GET | `/api/access/check/:patient_id/:doctor_id` | Check access status | Doctor/Patient |
| PUT | `/api/access/permissions` | Update access permissions | Patient only |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Firebase project with Firestore enabled
- npm or yarn

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd healthcare-backend
npm install
```

### 2. Environment Configuration
Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

Update `.env` with your Firebase credentials:
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key and download the JSON file
6. Extract the required values and add them to your `.env` file

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## 📝 API Usage Examples

### Patient Registration
```bash
curl -X POST http://localhost:3000/api/auth/patient/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "phone": "+1234567890",
    "age": 30,
    "gender": "male",
    "address": "123 Main St, City, State"
  }'
```

### Doctor Registration
```bash
curl -X POST http://localhost:3000/api/auth/doctor/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Smith",
    "email": "jane@hospital.com",
    "password": "securepassword",
    "specialization": "Cardiology",
    "hospital": "City General Hospital",
    "contact": "+1234567890",
    "license_number": "MD123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword",
    "userType": "patient"
  }'
```

### Upload Health Record
```bash
curl -X POST http://localhost:3000/api/records/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@health_report.pdf" \
  -F "patient_id=PATIENT_ID" \
  -F "notes=Annual checkup report"
```

### Grant Doctor Access
```bash
curl -X POST http://localhost:3000/api/access/grant \
  -H "Authorization: Bearer PATIENT_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "PATIENT_ID",
    "doctor_id": "DOCTOR_ID",
    "permissions": ["read", "write"],
    "expires_at": "2024-12-31T23:59:59Z"
  }'
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Access Control**: Granular permissions system
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **File Type Validation**: Restricted file upload types

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📁 Project Structure

```
healthcare-backend/
├── config/
│   └── firebase.js          # Firebase configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── recordsController.js # Health records logic
│   └── accessController.js  # Access control logic
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── validation.js       # Input validation
│   └── upload.js           # File upload handling
├── models/
│   ├── Patient.js          # Patient model
│   ├── Doctor.js           # Doctor model
│   ├── HealthRecord.js     # Health record model
│   └── AccessControl.js    # Access control model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── records.js          # Health records routes
│   └── access.js           # Access control routes
├── uploads/                 # File upload directory
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── server.js               # Main server file
└── README.md               # This file
```

## 🚀 Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Set up file storage (AWS S3, Google Cloud Storage, etc.)
- Configure proper logging and monitoring

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
