import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import auth_router, protected_router

# Create database tables
print("Creating database tables...")
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OTP Auth API",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(protected_router.router)

@app.get("/")
def read_root():
    """Root endpoint."""
    return {"message": "OTP Authentication API is running"}

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
