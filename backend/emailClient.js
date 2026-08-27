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

/**
 * Sends a security alert email when multiple device logins are detected.
 */
export const sendSecurityAlertEmail = async (toEmail, timestamp, ip, userAgent) => {
  const dateStr = new Date(timestamp).toLocaleString();
  
  let deviceType = 'Unknown Device';
  let browser = 'Unknown Browser';
  
  const ua = userAgent || '';
  if (ua.includes('Windows')) deviceType = 'Windows PC';
  else if (ua.includes('Macintosh')) deviceType = 'MacBook / Mac';
  else if (ua.includes('iPhone')) deviceType = 'iPhone';
  else if (ua.includes('Android')) deviceType = 'Android Mobile';
  else if (ua.includes('Linux')) deviceType = 'Linux System';
  
  if (ua.includes('Chrome')) browser = 'Google Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Apple Safari';
  else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
  else if (ua.includes('Edge')) browser = 'Microsoft Edge';

  const mailOptions = {
    from: '"ProForge AI Security" <playnest@zohomail.in>',
    to: toEmail,
    subject: '⚠️ Security Alert: New Login Activity Detected on Proforge AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #ef4444; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">⚠️ Security Alert</h2>
          <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">New Login Detected on your Proforge AI Account</p>
        </div>
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <p style="color: #1f2937; margin: 0; font-size: 14px; font-weight: 500;">Hello,</p>
          <p style="color: #4b5563; font-size: 13px; line-height: 1.5; margin: 8px 0 0 0;">
            We detected new login activity on your Proforge AI account. To keep your account secure, we notify you when new devices are used or repeated login attempts occur.
          </p>
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; color: #334155; line-height: 1.8;">
          <strong>Login Details:</strong><br/>
          • <strong>Time:</strong> ${dateStr}<br/>
          • <strong>IP Address:</strong> ${ip}<br/>
          • <strong>Operating System:</strong> ${deviceType}<br/>
          • <strong>Browser:</strong> ${browser}
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="http://localhost:5173/" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 6px; display: inline-block;">Secure Account</a>
        </div>
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0; border-top: 1px solid #f3f4f6; padding-top: 16px;">
          If this was you, no action is needed. If you do not recognize this activity, please change your credentials immediately.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Security alert email sent successfully to:', toEmail, info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending security alert email:', error);
    throw error;
  }
};

/**
 * Sends a diagnostic test email to check SMTP setup.
 */
export const sendTestEmail = async (toEmail) => {
  const mailOptions = {
    from: '"ProForge AI Diagnostics" <playnest@zohomail.in>',
    to: toEmail,
    subject: '🧪 Proforge AI: Test Diagnostics Email Dispatch',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #10b981; margin: 0; font-size: 28px; font-weight: bold;">🧪 Diagnostic Test</h2>
          <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">SMTP Mail Dispatch Diagnostics Verification</p>
        </div>
        <p style="color: #1f2937; font-size: 14px; line-height: 1.6;">
          This is a diagnostic verification email sent from your <strong>Proforge AI Settings Panel</strong>. If you are reading this, it means:
        </p>
        <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 6px; margin: 16px 0; font-size: 13px; color: #065f46;">
          ✓ Nodemailer client transport connection: <strong>SUCCESSFUL</strong><br/>
          ✓ Zoho SMTP authentication handshake: <strong>SUCCESSFUL</strong><br/>
          ✓ Destination inbox dispatch: <strong>SUCCESSFUL</strong>
        </div>
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
          Sent at: ${new Date().toLocaleString()} • Proforge AI Studio Diagnostics
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Diagnostic test email sent successfully to:', toEmail, info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending diagnostic test email:', error);
    throw error;
  }
};
