const { Resend } = require('resend');

class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@oaklandai.com';
  }

  // Send email verification
  async sendVerificationEmail(email, token, firstName = 'User') {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
      
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [email],
        subject: 'Verify your Oakland AI account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #22c55e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Oakland AI</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Smart help for small businesses</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0;">Welcome to Oakland AI, ${firstName}!</h2>
              
              <p style="color: #64748b; line-height: 1.6; margin-bottom: 25px;">
                Thank you for signing up! To complete your registration and start using Oakland AI, 
                please verify your email address by clicking the button below.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: 600; 
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #64748b; font-size: 14px; margin-top: 25px;">
                If the button doesn't work, you can copy and paste this link into your browser:
              </p>
              <p style="color: #3b82f6; font-size: 14px; word-break: break-all;">
                ${verificationUrl}
              </p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                This verification link will expire in 24 hours. If you didn't create an account with Oakland AI, 
                you can safely ignore this email.
              </p>
            </div>
          </div>
        `
      });

      if (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
      }

      return data;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, token, firstName = 'User') {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [email],
        subject: 'Reset your Oakland AI password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #22c55e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Oakland AI</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Smart help for small businesses</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0;">Password Reset Request</h2>
              
              <p style="color: #64748b; line-height: 1.6; margin-bottom: 25px;">
                Hi ${firstName}, we received a request to reset your password for your Oakland AI account. 
                Click the button below to create a new password.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: 600; 
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #64748b; font-size: 14px; margin-top: 25px;">
                If the button doesn't work, you can copy and paste this link into your browser:
              </p>
              <p style="color: #3b82f6; font-size: 14px; word-break: break-all;">
                ${resetUrl}
              </p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                This reset link will expire in 1 hour. If you didn't request a password reset, 
                you can safely ignore this email. Your password will remain unchanged.
              </p>
            </div>
          </div>
        `
      });

      if (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
      }

      return data;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email, firstName = 'User') {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [email],
        subject: 'Welcome to Oakland AI!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #22c55e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Oakland AI</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Smart help for small businesses</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0;">Welcome to Oakland AI, ${firstName}!</h2>
              
              <p style="color: #64748b; line-height: 1.6; margin-bottom: 25px;">
                Your account has been successfully verified! You're now ready to start using Oakland AI 
                to get smart help for your small business.
              </p>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #1e293b; margin: 0 0 15px 0;">What you can do with Oakland AI:</h3>
                <ul style="color: #64748b; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li>Get answers about business licenses and permits</li>
                  <li>Learn about parking rules and regulations</li>
                  <li>Find information about taxes and zoning</li>
                  <li>Get help with health & safety requirements</li>
                  <li>Access employment law guidance</li>
                  <li>And much more!</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/fullchat" 
                   style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: 600; 
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  Start Chatting Now
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                If you have any questions or need support, please don't hesitate to reach out to our team.
              </p>
            </div>
          </div>
        `
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send welcome email');
      }

      return data;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }
}

// Lazy-loaded email service instance
let emailServiceInstance = null;

const getEmailService = () => {
  if (!emailServiceInstance) {
    try {
      emailServiceInstance = new EmailService();
    } catch (error) {
      console.warn('Email service not available:', error.message);
      return null;
    }
  }
  return emailServiceInstance;
};

module.exports = {
  EmailService,
  getEmailService
}; 