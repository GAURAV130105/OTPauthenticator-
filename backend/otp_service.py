import hashlib
import secrets

OTP_EXPIRY_MINUTES = 2
MAX_ATTEMPTS = 5
RESEND_COOLDOWN_SECONDS = 60

def generate_otp() -> str:
    """Generate a random 6-digit OTP."""
    otp = secrets.randbelow(1000000)
    return f"{otp:06d}"

def hash_otp(otp: str) -> str:
    """Hash the OTP using SHA-256."""
    return hashlib.sha256(otp.encode()).hexdigest()

def verify_otp_hash(otp: str, otp_hash: str) -> bool:
    """Verify if the provided OTP matches the stored hash."""
    return hash_otp(otp) == otp_hash
