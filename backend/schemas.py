from pydantic import BaseModel, EmailStr
from datetime import datetime

class EmailRequest(BaseModel):
    """Schema for requesting an OTP."""
    email: EmailStr

class OTPVerifyRequest(BaseModel):
    """Schema for verifying an OTP."""
    email: EmailStr
    otp: str

class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str

class MessageResponse(BaseModel):
    """Schema for simple message responses."""
    message: str

class UserInfo(BaseModel):
    """Schema for returning user information."""
    email: str
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
