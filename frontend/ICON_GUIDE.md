# Icon Guide - Lucide React

## 🎯 Overview
We're using **Lucide React** for clean, minimal icons with an Apple-like aesthetic. These icons are perfect for modern web applications.

## 🚀 Quick Start

### 1. Installation
```bash
npm install lucide-react
```

### 2. Basic Usage
```jsx
import { Home, Settings, User } from 'lucide-react';

function MyComponent() {
  return (
    <div>
      <Home size={24} color="#3b82f6" />
      <Settings size={20} color="#6b7280" />
      <User size={32} color="#1f2937" />
    </div>
  );
}
```

## 🎨 Popular Icon Categories

### Navigation & UI
- `Home` - Home page
- `Settings` - Settings/configuration
- `User` - User profile
- `Search` - Search functionality
- `Menu` - Hamburger menu
- `X` - Close/cancel
- `Plus` - Add/create
- `Minus` - Remove/delete
- `Check` - Confirm/success
- `ArrowRight`, `ArrowLeft` - Navigation arrows
- `ChevronDown`, `ChevronUp` - Dropdown indicators

### Communication
- `MessageCircle` - Chat/messages
- `Phone` - Phone calls
- `Mail` - Email
- `Bell` - Notifications
- `Share` - Share content
- `Send` - Send message

### Actions & Interactions
- `Heart` - Like/favorite
- `Star` - Rate/favorite
- `Bookmark` - Save/bookmark
- `Download` - Download files
- `Upload` - Upload files
- `Edit` - Edit content
- `Trash2` - Delete
- `Copy` - Copy to clipboard
- `Save` - Save changes

### Media & Content
- `Camera` - Camera/photo
- `Play` - Play media
- `Pause` - Pause media
- `Volume2` - Audio volume
- `Image` - Image files
- `File` - Document files

### Location & Time
- `MapPin` - Location/address
- `Calendar` - Calendar/date
- `Clock` - Time
- `Navigation` - GPS/navigation

### Security & Privacy
- `Lock` - Locked/secure
- `Unlock` - Unlocked
- `Eye` - Visible
- `EyeOff` - Hidden/private
- `Shield` - Security

## 🎯 Icon Sizing Guide

```jsx
// Small icons (16px) - Inline text, labels
<Home size={16} />

// Medium icons (20-24px) - Buttons, navigation
<Settings size={20} />

// Large icons (32px) - Headers, prominent features
<User size={32} />

// Extra large (48px) - Hero sections, main CTAs
<Star size={48} />
```

## 🎨 Color Schemes

### Primary Colors
```jsx
// Blue (Primary)
<Home color="#3b82f6" />

// Green (Success)
<Check color="#22c55e" />

// Red (Error/Danger)
<X color="#ef4444" />

// Gray (Neutral)
<Settings color="#6b7280" />
```

### Apple-like Colors
```jsx
// System Blue
<Home color="#007AFF" />

// System Green
<Check color="#34C759" />

// System Red
<X color="#FF3B30" />

// System Gray
<Settings color="#8E8E93" />
```

## 🔧 Advanced Usage

### Custom Styling
```jsx
<Home 
  size={24} 
  color="#3b82f6" 
  strokeWidth={2}
  className="my-custom-icon"
  style={{ marginRight: '8px' }}
/>
```

### Interactive Icons
```jsx
const [isLiked, setIsLiked] = useState(false);

<Heart 
  size={24} 
  color={isLiked ? "#ef4444" : "#6b7280"}
  fill={isLiked ? "#ef4444" : "none"}
  onClick={() => setIsLiked(!isLiked)}
  style={{ cursor: 'pointer' }}
/>
```

### Icon with Labels
```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <User size={20} color="#3b82f6" />
  <span>Profile</span>
</div>
```

## 📱 Responsive Icons

```jsx
// Responsive sizing based on screen size
const IconSize = () => {
  const [size, setSize] = useState(24);
  
  useEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth < 768 ? 20 : 24);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <Home size={size} />;
};
```

## 🎨 Design Patterns

### Icon Buttons
```jsx
<button 
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f3f4f6',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
  onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
>
  <Settings size={20} color="#6b7280" />
</button>
```

### Icon with Badge
```jsx
<div style={{ position: 'relative' }}>
  <Bell size={24} color="#6b7280" />
  <div style={{
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    3
  </div>
</div>
```

## 🔗 Useful Links

- [Lucide Icons Website](https://lucide.dev/)
- [All Available Icons](https://lucide.dev/icons/)
- [GitHub Repository](https://github.com/lucide-icons/lucide)

## 🎯 Best Practices

1. **Consistency**: Use consistent sizes and colors throughout your app
2. **Accessibility**: Always provide alt text or labels for screen readers
3. **Performance**: Import only the icons you need
4. **Semantics**: Choose icons that clearly represent their function
5. **Spacing**: Use consistent spacing around icons (8px, 12px, 16px)

## 🚀 Demo

Visit `/icons` in your app to see a live demo of all available icons! 