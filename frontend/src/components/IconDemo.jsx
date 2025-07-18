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
    <div className="icon-demo-container">
      <h1 className="icon-demo-title">
        Lucide React Icons
      </h1>
      <p className="icon-demo-subtitle">
        Clean, minimal icons with Apple-like aesthetic
      </p>

      {iconGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="icon-group">
          <h2 className="icon-group-title">
            {group.title}
          </h2>
          <div className="icon-grid">
            {group.icons.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="icon-item">
                  <div className="icon-wrapper">
                    <IconComponent size={20} color="white" />
                  </div>
                  <span className="icon-name">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="usage-guide">
        <h3>
          How to use these icons:
        </h3>
        <pre className="code-block">
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