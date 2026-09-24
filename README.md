# Real-Time Email OTP Authentication System

A secure, real-time One-Time Password (OTP) authentication system built with FastAPI (Python) and React (Node.js). It supports user registration, login, and robust session management using JWTs.

## Features
- User registration and login flow
- Real-time Email OTP delivery
- JWT-based authentication
- Secure password hashing (bcrypt)
- React frontend with modern UI
- Fast and scalable backend using FastAPI

## Tech Stack
| Component | Technology |
| --- | --- |
| Backend | FastAPI (Python) |
| Frontend | React (Node.js) |
| Database | SQLite / SQLAlchemy |
| Auth | JWT, bcrypt |

## Prerequisites
- Python 3.8+
- Node.js 16+

## Quick Start
1. Clone or download the project to your machine.
2. Run `setup.bat` (on Windows) to install all dependencies for both backend and frontend. (On Linux/Mac, manually create a venv, install `backend/requirements.txt`, and run `npm install` in frontend).
3. Configure your `.env` file (e.g., `backend/.env`) with your SMTP credentials.
4. Run `start_backend.bat` to start the FastAPI server.
5. Run `start_frontend.bat` to start the React frontend.
6. Open your browser and navigate to `http://localhost:5173`.

## Gmail SMTP Setup Guide
To use Gmail for sending OTPs:
1. Go to your Google Account -> Security.
2. Enable 2-Step Verification if it's not already on.
3. Under "Signing in to Google", select "App passwords".
4. Create a new App password for "Mail" on your device.
5. Copy the generated 16-character password and use it as `SMTP_PASSWORD` in your `.env` file.

## Environment Variables
| Variable | Description |
| --- | --- |
| `JWT_SECRET_KEY` | Secret key for signing JSON Web Tokens. |
| `SMTP_HOST` | Hostname for your email provider's SMTP server (e.g., smtp.gmail.com). |
| `SMTP_PORT` | Port for your SMTP server (usually 587 for TLS). |
| `SMTP_USERNAME` | Your email address used for sending emails. |
| `SMTP_PASSWORD` | Your email password or app-specific password. |
| `FROM_EMAIL` | The email address that will appear as the sender. |
| `DEBUG` | Set to True for development mode. |

## API Endpoints
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and request OTP |
| POST | `/api/auth/verify-otp` | No | Verify OTP and get JWT token |
| GET | `/api/auth/me` | Yes | Get current user profile |
| POST | `/api/auth/resend-otp`| No | Resend OTP to email |
| POST | `/api/auth/logout` | Yes | Logout user (client-side token removal) |

## Database Schema
**Users Table**
- id (Integer, Primary Key)
- email (String, Unique)
- password_hash (String)
- is_active (Boolean)
- created_at (DateTime)

**OTP Codes Table**
- id (Integer, Primary Key)
- user_id (Integer, Foreign Key)
- code (String)
- expires_at (DateTime)
- is_used (Boolean)

## Security Features
- Passwords are hashed using bcrypt.
- OTPs expire after a set time (e.g., 5 minutes) and can only be used once.
- Protected routes require a valid JWT token.
- Environment variables are used for sensitive credentials.

## Project Structure
```text
d:/otpvalidator/
├── backend/
│   ├── .env
│   ├── requirements.txt
│   └── (FastAPI code files)
├── frontend/
│   └── (React code files)
├── .env.example
├── .gitignore
├── README.md
├── setup.bat
├── start_backend.bat
└── start_frontend.bat
```

## Troubleshooting
- **Email not sending**: Verify your SMTP credentials and ensure App Passwords are used correctly if using Gmail.
- **Port 8000/5173 in use**: Change the port in the respective batch scripts or terminate the process using that port.
- **Node modules missing**: Ensure you ran `setup.bat` or `npm install` in the frontend directory.

## License
MIT License
