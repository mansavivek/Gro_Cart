"""Transactional OTP email delivery via the Brevo API"""

import sib_api_v3_sdk
import os
from sib_api_v3_sdk.rest import ApiException
from dotenv import load_dotenv

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")


def send_otp_email(to_email: str, otp: str) -> bool:
    """Send an OTP verification email to the given address. Returns True on success."""
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = BREVO_API_KEY

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    subject = f"{otp} is your Gro-Cart verification code"
    html_content = f"""
    <html>
      <body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, Helvetica, sans-serif; color:#222222;">
        <div style="max-width:600px; margin:0 auto; padding:40px 30px;">

          <p style="font-size:18px; margin:0 0 24px 0;">Welcome back!</p>

          <p style="font-size:18px; line-height:1.6; margin:0 0 30px 0;">
            Please enter the following code to log back into your Gro-Cart account:
          </p>

          <div style="font-size:42px; font-weight:700; letter-spacing:2px; margin:10px 0 40px 0; color:#111111;">
            {otp}
          </div>
        </div>
      </body>
    </html>
    """

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": to_email}],
        sender={"email": "shdevika@umich.edu", "name": "Gro-Cart"},
        subject=subject,
        html_content=html_content
    )

    try:
        api_instance.send_transac_email(send_smtp_email)
        return True
    except ApiException as e:
        print("Error sending email:", e)
        return False
