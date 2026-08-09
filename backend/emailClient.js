import nodemailer from 'nodemailer';

// Configure SMTP transport using Zoho Mail credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 587,
  secure: false, // Use STARTTLS (true for 465, false for 587)
  auth: {
    user: 'playnest@zohomail.in',
    pass: 'Dhruv2007@PN'
  },
  tls: {
    rejectUnauthorized: false // Avoid potential certificate issues
  }
});

/**
 * Sends a 6-digit OTP verification email to the user.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} otp - The 6-digit OTP code.
 */
export const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: '"ProForge AI Studio" <playnest@zohomail.in>',
    to: toEmail,
    subject: 'Your ProForge AI Studio Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #3b82f6; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">ProForge AI Studio</h2>
          <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">AI Resume & Personal Branding Studio (incorporating Remo AI)</p>
        </div>
        <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <p style="color: #1f2937; margin: 0; font-size: 16px; font-weight: 500;">Hello!</p>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 8px 0 0 0;">
            Use the verification code below to access your account. This OTP is valid for the next 5 minutes.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: 800; color: #1e40af; letter-spacing: 6px; display: inline-block;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; border-top: 1px solid #f3f4f6; padding-top: 16px;">
          If you did not request this code, you can safely ignore this email.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending OTP Email:', error);
    throw error;
  }
};
