const twilio = require('twilio');

class SMSService {
  constructor() {
    // Only initialize Twilio client if credentials are properly configured
    if (process.env.TWILIO_ACCOUNT_SID && 
        process.env.TWILIO_ACCOUNT_SID.startsWith('AC') && 
        process.env.TWILIO_AUTH_TOKEN && 
        process.env.TWILIO_PHONE_NUMBER) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
      this.enabled = true;
    } else {
      this.enabled = false;
      console.log('SMS service disabled - Twilio credentials not properly configured');
    }
  }

  // Send verification code via SMS
  async sendVerificationCode(phoneNumber, code) {
    if (!this.enabled) {
      console.log('SMS service disabled - verification code would be:', code);
      return { success: true, message: 'SMS service disabled' };
    }
    
    try {
      const message = await this.client.messages.create({
        body: `Your Oakland AI verification code is: ${code}. This code will expire in 10 minutes.`,
        from: this.fromNumber,
        to: phoneNumber
      });

      return message;
    } catch (error) {
      console.error('Error sending SMS verification:', error);
      throw new Error('Failed to send SMS verification');
    }
  }

  // Send welcome SMS
  async sendWelcomeSMS(phoneNumber, firstName = 'User') {
    if (!this.enabled) {
      console.log('SMS service disabled - welcome SMS would be sent to:', phoneNumber);
      return { success: true, message: 'SMS service disabled' };
    }
    
    try {
      const message = await this.client.messages.create({
        body: `Welcome to Oakland AI, ${firstName}! Your account has been verified. Start getting smart help for your business at ${process.env.FRONTEND_URL}/fullchat`,
        from: this.fromNumber,
        to: phoneNumber
      });

      return message;
    } catch (error) {
      console.error('Error sending welcome SMS:', error);
      throw new Error('Failed to send welcome SMS');
    }
  }

  // Generate a random 6-digit code
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber) {
    // Basic validation - you might want to use a library like libphonenumber-js for more robust validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  // Format phone number for display
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // If it's a US number without country code, add +1
    if (cleaned.length === 10 && !cleaned.startsWith('+')) {
      return `+1${cleaned}`;
    }
    
    // If it doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  }
}

module.exports = new SMSService(); 