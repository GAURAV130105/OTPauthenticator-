from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User, OTPVerification
from schemas import EmailRequest, OTPVerifyRequest, TokenResponse, MessageResponse, UserInfo
from auth import create_access_token, get_current_user
from otp_service import (
    generate_otp, hash_otp, verify_otp_hash, 
    OTP_EXPIRY_MINUTES, MAX_ATTEMPTS, RESEND_COOLDOWN_SECONDS
)
from email_service import send_otp_email

router = APIRouter(prefix="/api/auth", tags=["auth"])

def _send_otp_logic(email: str, db: Session, create_user_if_not_exists: bool = True) -> MessageResponse:
    """Internal logic to handle sending OTP."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        if create_user_if_not_exists:
            user = User(email=email)
            db.add(user)
            db.commit()
        else:
            raise HTTPException(status_code=404, detail="User not found")
            
    now = datetime.utcnow()
    recent_otp = db.query(OTPVerification).filter(
        OTPVerification.email == email,
        OTPVerification.used == False,
        OTPVerification.expires_at > now
    ).order_by(OTPVerification.created_at.desc()).first()

    if recent_otp and (now - recent_otp.created_at).total_seconds() < RESEND_COOLDOWN_SECONDS:
        raise HTTPException(
            status_code=429, 
            detail="Please wait before requesting a new OTP"
        )
        
    db.query(OTPVerification).filter(
        OTPVerification.email == email,
        OTPVerification.used == False
    ).update({"used": True})
    db.commit()

    otp = generate_otp()
    hashed = hash_otp(otp)
    expires_at = now + timedelta(minutes=OTP_EXPIRY_MINUTES)
    
    otp_record = OTPVerification(
        email=email,
        otp_hash=hashed,
        expires_at=expires_at,
        created_at=now
    )
    db.add(otp_record)
    db.commit()
    
    email_sent = send_otp_email(email, otp)
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send OTP email")
        
    return MessageResponse(message="OTP sent to your email")

@router.post("/send-otp", response_model=MessageResponse)
def send_otp(request: EmailRequest, db: Session = Depends(get_db)):
    """Request an OTP for an email. Creates user if not exists."""
    return _send_otp_logic(request.email, db, create_user_if_not_exists=True)

@router.post("/resend-otp", response_model=MessageResponse)
def resend_otp(request: EmailRequest, db: Session = Depends(get_db)):
    """Resend an OTP. Fails if user does not exist."""
    return _send_otp_logic(request.email, db, create_user_if_not_exists=False)

@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(request: OTPVerifyRequest, db: Session = Depends(get_db)):
    """Verify an OTP and return a JWT access token on success."""
    now = datetime.utcnow()
    otp_record = db.query(OTPVerification).filter(
        OTPVerification.email == request.email,
        OTPVerification.used == False
    ).order_by(OTPVerification.created_at.desc()).first()
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="No valid OTP found. Please request a new one.")
        
    if otp_record.expires_at < now:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
        
    otp_record.attempts += 1
    db.commit()
    
    if otp_record.attempts > MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many attempts. Please request a new OTP.")
        
    if not verify_otp_hash(request.otp, otp_record.otp_hash):
        remaining = MAX_ATTEMPTS - otp_record.attempts
        raise HTTPException(status_code=400, detail=f"Invalid OTP. {remaining} attempts remaining.")
        
    otp_record.used = True
    
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        user.is_verified = True
        user.last_login = now
        
    db.commit()
    
    access_token = create_access_token(request.email)
    return TokenResponse(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserInfo)
def get_me(current_user: User = Depends(get_current_user)):
    """Get information about the currently authenticated user."""
    return current_user
