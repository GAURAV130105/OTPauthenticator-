import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_otp_email(to_email: str, otp: str) -> bool:
    """Send an OTP email to the user."""
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_port = int(os.environ.get("SMTP_PORT", 587))
    smtp_username = os.environ.get("SMTP_USERNAME")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    from_email = os.environ.get("FROM_EMAIL", "noreply@example.com")
    
    if not smtp_host or not smtp_username or not smtp_password:
        print("Warning: SMTP credentials not fully configured.")
        # Return False to trigger the 500 error in route for incomplete env
        return False

    subject = "Your Verification Code"
    body = f"""Hello,

Your verification code is:

{otp}

This OTP is valid for 2 minutes.
Please do not share this code with anyone.

Regards,
Authentication System"""

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        print(f"Connecting to SMTP server {smtp_host}:{smtp_port}...")
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f"OTP email sent successfully to {to_email}.")
        return True
    except Exception as e:
        print(f"Failed to send OTP email to {to_email}: {e}")
        return False
