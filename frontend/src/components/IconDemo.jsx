import React from 'react';
import { 
  Home, 
  Settings, 
  User, 
  Search, 
  MessageCircle, 
  Heart, 
  Star, 
  Camera, 
  Phone, 
  Mail,
  MapPin,
  Calendar,
  Clock,
  Download,
  Upload,
  Share,
  Bookmark,
  Bell,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Check,
  X,
  Plus,
  Minus,
  Edit,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Play,
  Navigation,
  Copy,
  Save
} from 'lucide-react';

const IconDemo = () => {
  const iconGroups = [
    {
      title: "Navigation",
      icons: [
        { icon: Home, name: "Home" },
        { icon: Settings, name: "Settings" },
        { icon: User, name: "User" },
        { icon: Search, name: "Search" }
      ]
    },
    {
      title: "Communication",
      icons: [
        { icon: MessageCircle, name: "Message" },
        { icon: Phone, name: "Phone" },
        { icon: Mail, name: "Mail" },
        { icon: Bell, name: "Notifications" }
      ]
    },
    {
      title: "Actions",
      icons: [
        { icon: Heart, name: "Like" },
        { icon: Star, name: "Favorite" },
        { icon: Bookmark, name: "Bookmark" },
        { icon: Share, name: "Share" }
      ]
    },
    {
      title: "Media",
      icons: [
        { icon: Camera, name: "Camera" },
        { icon: Download, name: "Download" },
        { icon: Upload, name: "Upload" },
        { icon: Play, name: "Play" }
      ]
    },
    {
      title: "Location & Time",
      icons: [
        { icon: MapPin, name: "Location" },
        { icon: Calendar, name: "Calendar" },
        { icon: Clock, name: "Time" },
        { icon: Navigation, name: "Navigation" }
      ]
    },
    {
      title: "Security",
      icons: [
        { icon: Lock, name: "Lock" },
        { icon: Unlock, name: "Unlock" },
        { icon: Eye, name: "Visible" },
        { icon: EyeOff, name: "Hidden" }
      ]
    },
    {
      title: "Controls",
      icons: [
        { icon: Check, name: "Check" },
        { icon: X, name: "Close" },
        { icon: Plus, name: "Add" },
        { icon: Minus, name: "Remove" }
      ]
    },
    {
      title: "Editing",
      icons: [
        { icon: Edit, name: "Edit" },
        { icon: Trash2, name: "Delete" },
        { icon: Copy, name: "Copy" },
        { icon: Save, name: "Save" }
      ]
    },
    {
      title: "Arrows",
      icons: [
        { icon: ArrowRight, name: "Right" },
        { icon: ArrowLeft, name: "Left" },
        { icon: ChevronDown, name: "Down" },
        { icon: ChevronUp, name: "Up" }
      ]
    }
  ];

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: '600', 
        marginBottom: '8px',
        color: '#1f2937'
      }}>
        Lucide React Icons
      </h1>
      <p style={{ 
        fontSize: '16px', 
        color: '#6b7280', 
        marginBottom: '32px'
      }}>
        Clean, minimal icons with Apple-like aesthetic
      </p>

      {iconGroups.map((group, groupIndex) => (
        <div key={groupIndex} style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#374151'
          }}>
            {group.title}
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {group.icons.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '8px',
                    marginRight: '12px'
                  }}>
                    <IconComponent size={20} color="white" />
                  </div>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ 
        marginTop: '40px', 
        padding: '24px', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '12px',
        border: '1px solid #bae6fd'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '12px',
          color: '#0369a1'
        }}>
          How to use these icons:
        </h3>
        <pre style={{ 
          backgroundColor: '#1e293b', 
          color: '#e2e8f0', 
          padding: '16px', 
          borderRadius: '8px',
          fontSize: '14px',
          overflow: 'auto'
        }}>
{`// 1. Import the icons you need
import { Home, Settings, User } from 'lucide-react';

// 2. Use them in your components
function MyComponent() {
  return (
    <div>
      <Home size={24} color="#3b82f6" />
      <Settings size={20} color="#6b7280" />
      <User size={32} color="#1f2937" />
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
};

export default IconDemo; 