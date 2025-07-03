# Oakland AI Frontend

React-based frontend application for the Oakland AI Chatbot, built with Vite and modern React features.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   └── vite.svg           # Vite logo
├── src/
│   ├── components/        # Reusable React components
│   │   ├── ChatWindow.jsx # Main chat interface
│   │   ├── FAQSuggestions.jsx # FAQ suggestion component
│   │   └── VoiceInput.jsx # Voice input functionality
│   ├── pages/             # Page components
│   │   ├── AdminPage.jsx  # Admin dashboard
│   │   ├── ChatPage.jsx   # Main chat page
│   │   └── LoginPage.jsx  # Authentication page
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (if configured)
npm test

# Lint code (if configured)
npm run lint
```

### Development Server

The development server runs on http://localhost:3000 by default. It includes:
- Hot Module Replacement (HMR)
- Fast refresh for React components
- Source maps for debugging
- Error overlay for runtime errors

## 🎨 Components

### Core Components

#### ChatWindow.jsx
Main chat interface component that handles:
- Message display and history
- User input handling
- Real-time chat functionality
- Message formatting

**Props:**
```jsx
<ChatWindow 
  messages={messages}
  onSendMessage={handleSendMessage}
  isLoading={isLoading}
  user={currentUser}
/>
```

#### FAQSuggestions.jsx
Displays frequently asked questions as clickable suggestions.

**Props:**
```jsx
<FAQSuggestions 
  suggestions={faqList}
  onSuggestionClick={handleSuggestionClick}
  isLoading={isLoading}
/>
```

#### VoiceInput.jsx
Handles voice input functionality with speech recognition.

**Props:**
```jsx
<VoiceInput 
  onVoiceInput={handleVoiceInput}
  isListening={isListening}
  onToggleListening={toggleListening}
/>
```

### Page Components

#### ChatPage.jsx
Main chat page that combines all chat-related components.

**Features:**
- Chat interface
- FAQ suggestions
- Voice input
- User authentication status

#### LoginPage.jsx
Authentication page for user login and registration.

**Features:**
- Login form
- Registration form
- Form validation
- Error handling

#### AdminPage.jsx
Admin dashboard for analytics and user management.

**Features:**
- Usage analytics
- User management
- System statistics
- Admin-only functionality

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_VOICE_INPUT=true
VITE_ENABLE_ANALYTICS=true

# External Services
VITE_OPENAI_ENABLED=true
VITE_SPEECH_ENABLED=true
```

### Vite Configuration

The `vite.config.js` file configures:
- React plugin
- Development server settings
- Build optimization
- Asset handling

## 🎯 Features

### Chat Functionality
- Real-time messaging with AI
- Message history persistence
- Typing indicators
- Message timestamps
- Rich text formatting

### Voice Input
- Speech-to-text conversion
- Voice command support
- Microphone access handling
- Audio feedback

### FAQ System
- Dynamic FAQ suggestions
- Click-to-ask functionality
- Categorized questions
- Search functionality

### User Authentication
- JWT token management
- Login/logout functionality
- User session persistence
- Protected routes

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Adaptive layouts

## 🧪 Testing

### Component Testing
```bash
# Run component tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Manual Testing Checklist
- [ ] Chat functionality works
- [ ] Voice input works
- [ ] FAQ suggestions work
- [ ] Authentication flows work
- [ ] Responsive design works
- [ ] Error handling works

## 🎨 Styling

### CSS Architecture
- Global styles in `index.css`
- Component-specific styles
- CSS variables for theming
- Responsive design utilities

### Design System
- Consistent color palette
- Typography scale
- Spacing system
- Component variants

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Features
- Touch-friendly buttons
- Swipe gestures
- Optimized layouts
- Performance optimization

## 🔌 API Integration

### Backend Communication
- RESTful API calls
- JWT authentication
- Error handling
- Loading states

### Real-time Features
- WebSocket connections (if implemented)
- Polling for updates
- Optimistic updates
- Offline support

## 🚀 Build & Deployment

### Production Build
```bash
# Create optimized build
npm run build

# Preview build locally
npm run preview
```

### Build Output
The build process creates:
- Optimized JavaScript bundles
- Minified CSS
- Compressed assets
- Service worker (if configured)

### Deployment Options
- Static hosting (Netlify, Vercel)
- CDN deployment
- Docker containerization
- Cloud platform deployment

## 🔒 Security

### Best Practices
- Environment variable protection
- Input validation
- XSS prevention
- CSRF protection
- Secure authentication

### Content Security Policy
- Script source restrictions
- Style source restrictions
- Image source restrictions
- Frame restrictions

## 📊 Performance

### Optimization Techniques
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization
- Caching strategies

### Monitoring
- Performance metrics
- Error tracking
- User analytics
- Load time monitoring

## 🆘 Troubleshooting

### Common Issues

1. **Development Server Won't Start**
   - Check if port 3000 is available
   - Verify Node.js version
   - Clear npm cache

2. **API Connection Issues**
   - Verify backend server is running
   - Check API base URL configuration
   - Verify CORS settings

3. **Build Errors**
   - Check for syntax errors
   - Verify all dependencies are installed
   - Clear build cache

### Debug Mode
```bash
# Enable React DevTools
# Install React Developer Tools browser extension

# Enable Vite debug mode
DEBUG=vite:* npm run dev
```

## 📝 Development Guidelines

### Code Style
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use TypeScript for type safety (if configured)

### Component Guidelines
- Keep components small and focused
- Use proper prop validation
- Implement proper loading states
- Handle edge cases gracefully

### State Management
- Use React Context for global state
- Implement proper state updates
- Handle async operations correctly
- Use proper error handling

---

**Note**: Make sure the backend server is running before starting the frontend development server. 