import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLanguageNames } from '../language/languages';
import { config } from '../env';
import '../css/pages/signup.css';

function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    // Required fields
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    businessType: '',
    
    // Address fields (optional)
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Demographics (optional)
    language: 'en',
    age: '',
    ethnicity: '',
    gender: '',
    
    // Business details (optional)
    employeeCount: '',
    yearsInBusiness: '',
    corporationType: '',
    
    // Financial information (optional)
    annualRevenue2022: '',
    annualRevenue2023: '',
    annualRevenue2024: ''
  });

  const [errors, setErrors] = useState({});

  // Available options
  const businessTypes = [
    'Restaurant/Food Service',
    'Retail',
    'Professional Services',
    'Manufacturing',
    'Construction',
    'Healthcare',
    'Technology',
    'Real Estate',
    'Transportation',
    'Entertainment',
    'Non-profit',
    'Other'
  ];

  const corporationTypes = [
    'Sole Proprietorship',
    'Partnership',
    'LLC (Limited Liability Company)',
    'C Corporation',
    'S Corporation',
    'Non-profit Corporation',
    'Cooperative',
    'Other'
  ];

  const genderOptions = [
    'Male',
    'Female',
    'Non-binary',
    'Prefer not to say'
  ];

  const ethnicityOptions = [
    'White',
    'Black or African American',
    'Hispanic or Latino',
    'Asian',
    'Native American',
    'Pacific Islander',
    'Middle Eastern',
    'Mixed Race',
    'Other',
    'Prefer not to say'
  ];

  const availableLanguages = getLanguageNames();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

          // Debug: Log what we're sending
      console.log('Sending signup data:', formData);
      console.log('API URL:', `${config.VITE_API_URL}/api/auth/register`);

      try {
        const response = await fetch(`${config.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Success response:', data);
        // Redirect to login with verification message
        navigate('/login?message=verification_required');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(errorData.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="signup-step">
      <h3>Basic Information</h3>
      <p className="step-description">Let's start with your basic information</p>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={errors.firstName ? 'form-input error' : 'form-input'}
            placeholder="Enter your first name"
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={errors.lastName ? 'form-input error' : 'form-input'}
            placeholder="Enter your last name"
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={errors.email ? 'form-input error' : 'form-input'}
          placeholder="Enter your email address"
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Enter your phone number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="businessType">Type of Business *</label>
        <select
          id="businessType"
          name="businessType"
          value={formData.businessType}
          onChange={handleInputChange}
          className={errors.businessType ? 'form-input error' : 'form-input'}
        >
          <option value="">Select your business type</option>
          {businessTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.businessType && <span className="error-message">{errors.businessType}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={errors.password ? 'form-input error' : 'form-input'}
            placeholder="Create a password"
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={errors.confirmPassword ? 'form-input error' : 'form-input'}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="signup-step">
      <h3>Address Information</h3>
      <p className="step-description">Your business address (optional)</p>
      
      <div className="form-group">
        <label htmlFor="addressLine1">Address Line 1</label>
        <input
          type="text"
          id="addressLine1"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Street address"
        />
      </div>

      <div className="form-group">
        <label htmlFor="addressLine2">Address Line 2</label>
        <input
          type="text"
          id="addressLine2"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Apartment, suite, etc."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="form-input"
            placeholder="City"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="form-input"
            placeholder="State"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            className="form-input"
            placeholder="ZIP Code"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="signup-step">
      <h3>Demographics & Preferences</h3>
      <p className="step-description">Help us provide better service (optional)</p>
      
      <div className="form-group">
        <label htmlFor="language">Preferred Language</label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          className="form-input"
        >
          {availableLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Your age"
            min="18"
            max="120"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">Select gender</option>
            {genderOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="ethnicity">Ethnicity</label>
        <select
          id="ethnicity"
          name="ethnicity"
          value={formData.ethnicity}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="">Select ethnicity</option>
          {ethnicityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="signup-step">
      <h3>Business Details</h3>
      <p className="step-description">Tell us about your business (optional)</p>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="employeeCount">Number of Employees</label>
          <input
            type="number"
            id="employeeCount"
            name="employeeCount"
            value={formData.employeeCount}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Number of employees"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="yearsInBusiness">Years in Business</label>
          <input
            type="number"
            id="yearsInBusiness"
            name="yearsInBusiness"
            value={formData.yearsInBusiness}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Years in business"
            min="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="corporationType">Type of Corporation</label>
        <select
          id="corporationType"
          name="corporationType"
          value={formData.corporationType}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="">Select corporation type</option>
          {corporationTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="signup-step">
      <h3>Financial Information</h3>
      <p className="step-description">Annual revenue for the past 2 years (optional)</p>
      
      <div className="form-group">
        <label htmlFor="annualRevenue2022">Annual Revenue 2022</label>
        <input
          type="number"
          id="annualRevenue2022"
          name="annualRevenue2022"
          value={formData.annualRevenue2022}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Annual revenue in USD"
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label htmlFor="annualRevenue2023">Annual Revenue 2023</label>
        <input
          type="number"
          id="annualRevenue2023"
          name="annualRevenue2023"
          value={formData.annualRevenue2023}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Annual revenue in USD"
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label htmlFor="annualRevenue2024">Annual Revenue 2024 (Projected)</label>
        <input
          type="number"
          id="annualRevenue2024"
          name="annualRevenue2024"
          value={formData.annualRevenue2024}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Projected annual revenue in USD"
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <div className="main-container">
      {/* Left side - Welcome section */}
      <div className="welcome-section">
        <div className="logo-section">
          <div className="logo-text" style={{
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>Oakland AI</div>
        </div>
        
        <h1 className="main-heading">
          Join Oakland AI<br />
          Smart help for<br />
          your business.
        </h1>
        <p className="sub-heading">
          Get personalized assistance<br />
          in your language.
        </p>
        
        {/* Progress indicator */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">Step {currentStep} of 5</p>
        </div>
      </div>

      {/* Right side - Signup section */}
      <div className="signup-section">
        <div className="signup-container">
          {/* Back button */}
          <button 
            onClick={() => navigate('/login')}
            className="back-button"
            style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#3b82f6',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>

          <div className="signup-content">
            {renderStepContent()}
            
            <div className="signup-actions">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={handleBack}
                  className="secondary-button"
                >
                  Back
                </button>
              )}
              
              {currentStep < 5 ? (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="primary-button"
                >
                  Next
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="primary-button"
                  style={{
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage; 