# Oakland AI Database Blueprint 📊

## 🏗️ Database Architecture Overview

The Oakland AI database is designed as a comprehensive PostgreSQL system supporting user authentication, chat functionality, analytics, and admin management while maintaining user privacy through anonymous tracking.

## 📋 Database Schema Design

### Core Tables Structure

```
┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│     users       │    │ email_verifications │    │ sms_verifications   │
├─────────────────┤    ├─────────────────────┤    ├─────────────────────┤
│ id (PK)         │    │ id (PK)             │    │ id (PK)             │
│ email (UQ)      │◄───┤ user_id (FK)        │    │ user_id (FK)        │
│ password_hash   │    │ email               │    │ phone               │
│ first_name      │    │ token               │    │ code                │
│ last_name       │    │ expires_at          │    │ expires_at          │
│ phone           │    │ verified_at         │    │ verified_at         │
│ language        │    │ created_at          │    │ created_at          │
│ business_type   │    └─────────────────────┘    └─────────────────────┘
│ is_verified     │
│ is_admin        │
│ ...             │
└─────────────────┘
        │
        ▼
┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   chat_logs     │    │ faq_interactions    │    │  user_sessions      │
├─────────────────┤    ├─────────────────────┤    ├─────────────────────┤
│ id (PK)         │    │ id (PK)             │    │ id (PK)             │
│ user_id (FK)    │    │ user_id (FK)        │    │ user_id (FK)        │
│ anonymous_id    │    │ anonymous_id        │    │ session_token (UQ)  │
│ message         │    │ faq_question        │    │ ip_address          │
│ response        │    │ business_type       │    │ user_agent          │
│ business_type   │    │ language            │    │ expires_at          │
│ language        │    │ session_id          │    │ created_at          │
│ session_id      │    │ clicked_at          │    └─────────────────────┘
│ ip_address      │    └─────────────────────┘
│ user_agent      │
│ created_at      │
└─────────────────┘
        │
        ▼
┌─────────────────┐    ┌─────────────────────┐
│analytics_events │    │  admin_audit_log    │
├─────────────────┤    ├─────────────────────┤
│ id (PK)         │    │ id (PK)             │
│ user_id (FK)    │    │ admin_user_id (FK)  │
│ anonymous_id    │    │ action              │
│ event_type      │    │ target_type         │
│ event_data      │    │ target_id           │
│ business_type   │    │ details             │
│ language        │    │ ip_address          │
│ session_id      │    │ created_at          │
│ ip_address      │    └─────────────────────┘
│ user_agent      │
│ created_at      │
└─────────────────┘
```

## 🗂️ Table Details

### 1. Users Table (`users`)
**Purpose**: Core user account management with authentication and profile data

**Key Features**:
- **Email-based authentication** with unique constraint
- **Password hashing** using bcrypt (12 rounds)
- **Multi-language support** with default 'en'
- **Business type categorization** for targeted responses
- **Admin flag** for role-based access control
- **Account verification** system
- **Security features**: login attempts, account locking, password reset

**Columns**:
```sql
id SERIAL PRIMARY KEY
email TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
first_name TEXT
last_name TEXT
phone TEXT
language TEXT DEFAULT 'en'
business_type TEXT
is_verified BOOLEAN DEFAULT FALSE
is_admin BOOLEAN DEFAULT FALSE
email_verification_token TEXT
email_verification_expires TIMESTAMP
password_reset_token TEXT
password_reset_expires TIMESTAMP
last_login TIMESTAMP
login_attempts INTEGER DEFAULT 0
locked_until TIMESTAMP
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### 2. Email Verifications (`email_verifications`)
**Purpose**: Email verification workflow management

**Features**:
- **Token-based verification** with expiration
- **Cascade deletion** when user is deleted
- **Audit trail** of verification attempts

### 3. SMS Verifications (`sms_verifications`)
**Purpose**: Phone number verification via SMS

**Features**:
- **Code-based verification** (6-digit codes)
- **Expiration handling** for security
- **Multiple attempts tracking**

### 4. Chat Logs (`chat_logs`)
**Purpose**: Store chat interactions with anonymous analytics support

**Key Features**:
- **Dual tracking**: authenticated users + anonymous users
- **Business context**: business_type for targeted analytics
- **Language tracking**: for multi-language analytics
- **Session management**: session_id for conversation flow
- **Privacy protection**: anonymous_id for unauthenticated users

**Analytics Support**:
- Track popular questions by business type
- Language usage patterns
- User engagement metrics
- Session duration analysis

### 5. FAQ Interactions (`faq_interactions`)
**Purpose**: Track FAQ usage and effectiveness

**Features**:
- **Click tracking** for FAQ suggestions
- **Business-specific** FAQ analytics
- **Anonymous user** support

### 6. User Sessions (`user_sessions`)
**Purpose**: Active session management for security

**Features**:
- **JWT token storage** for session validation
- **IP tracking** for security monitoring
- **Automatic expiration** handling
- **Device fingerprinting** via user_agent

### 7. Analytics Events (`analytics_events`)
**Purpose**: Comprehensive user behavior tracking

**Event Types**:
- `page_view` - Page visit tracking
- `chat_start` - Chat session initiation
- `chat_end` - Chat session completion
- `faq_click` - FAQ interaction
- `language_change` - Language preference changes
- `business_type_select` - Business type selection

**Features**:
- **JSONB storage** for flexible event data
- **Anonymous tracking** for privacy compliance
- **Business context** for targeted insights

### 8. Admin Audit Log (`admin_audit_log`)
**Purpose**: Admin action tracking for security and compliance

**Tracked Actions**:
- `user_create` - User account creation
- `user_update` - User profile updates
- `user_delete` - User account deletion
- `chat_view` - Chat log access
- `analytics_export` - Data export actions
- `system_config` - System configuration changes

## 🔗 Relationships & Constraints

### Foreign Key Relationships
```sql
-- Email verifications → Users
email_verifications.user_id → users.id (CASCADE)

-- SMS verifications → Users  
sms_verifications.user_id → users.id (CASCADE)

-- Chat logs → Users
chat_logs.user_id → users.id (SET NULL)

-- FAQ interactions → Users
faq_interactions.user_id → users.id (SET NULL)

-- User sessions → Users
user_sessions.user_id → users.id (CASCADE)

-- Analytics events → Users
analytics_events.user_id → users.id (SET NULL)

-- Admin audit log → Users
admin_audit_log.admin_user_id → users.id (SET NULL)
```

### Unique Constraints
- `users.email` - Email uniqueness
- `user_sessions.session_token` - Session token uniqueness

## 📈 Performance Optimization

### Indexes Strategy
```sql
-- User lookup optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_verified ON users(is_verified);
CREATE INDEX idx_users_is_admin ON users(is_admin);

-- Chat analytics optimization
CREATE INDEX idx_chat_logs_user_id ON chat_logs(user_id);
CREATE INDEX idx_chat_logs_anonymous_id ON chat_logs(anonymous_id);
CREATE INDEX idx_chat_logs_created_at ON chat_logs(created_at);
CREATE INDEX idx_chat_logs_business_type ON chat_logs(business_type);
CREATE INDEX idx_chat_logs_language ON chat_logs(language);

-- FAQ analytics optimization
CREATE INDEX idx_faq_interactions_user_id ON faq_interactions(user_id);
CREATE INDEX idx_faq_interactions_anonymous_id ON faq_interactions(anonymous_id);
CREATE INDEX idx_faq_interactions_clicked_at ON faq_interactions(clicked_at);

-- Session management optimization
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);

-- Analytics optimization
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_anonymous_id ON analytics_events(anonymous_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Admin audit optimization
CREATE INDEX idx_admin_audit_log_admin_user_id ON admin_audit_log(admin_user_id);
CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at);
```

### Triggers & Functions
```sql
-- Automatic timestamp updates
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## 🔒 Security & Privacy Design

### Privacy Protection
1. **Anonymous Tracking**: Unauthenticated users tracked via `anonymous_id`
2. **Data Anonymization**: Personal data separated from analytics
3. **Session Isolation**: Each session has unique identifier
4. **Audit Trail**: All admin actions logged for compliance

### Security Features
1. **Password Security**: bcrypt hashing with 12 rounds
2. **Account Lockout**: After 5 failed login attempts
3. **Token Expiration**: All verification tokens expire
4. **Session Management**: Secure session tokens with expiration
5. **IP Tracking**: Monitor for suspicious activity

### Data Retention
- **Chat logs**: 1 year retention (configurable)
- **Sessions**: Automatic cleanup of expired sessions
- **Verification tokens**: Immediate cleanup after use
- **Analytics**: Anonymous data retained for insights

## 📊 Analytics & Reporting

### Key Metrics Tracked
1. **User Engagement**
   - Daily/Monthly active users
   - Session duration
   - Chat frequency

2. **Business Insights**
   - Popular questions by business type
   - Language preferences
   - FAQ effectiveness

3. **System Performance**
   - Response times
   - Error rates
   - User satisfaction

### Sample Queries

#### User Analytics
```sql
-- Daily active users
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as authenticated_users,
    COUNT(DISTINCT anonymous_id) as anonymous_users
FROM analytics_events 
WHERE event_type = 'chat_start'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### Business Type Analysis
```sql
-- Popular questions by business type
SELECT 
    business_type,
    COUNT(*) as question_count,
    COUNT(DISTINCT user_id) as unique_users
FROM chat_logs 
WHERE business_type IS NOT NULL
GROUP BY business_type
ORDER BY question_count DESC;
```

#### Language Usage
```sql
-- Language distribution
SELECT 
    language,
    COUNT(*) as usage_count,
    COUNT(DISTINCT user_id) as unique_users
FROM chat_logs 
GROUP BY language
ORDER BY usage_count DESC;
```

## 🚀 Scalability Considerations

### Horizontal Scaling
- **Read Replicas**: Analytics queries on separate instances
- **Sharding**: Business type-based sharding for large datasets
- **Caching**: Redis for session management and frequent queries

### Vertical Scaling
- **Connection Pooling**: pgBouncer for connection management
- **Query Optimization**: Regular query analysis and optimization
- **Index Maintenance**: Regular index rebuilding and statistics updates

### Data Archiving
- **Partitioning**: Time-based partitioning for large tables
- **Archiving**: Move old data to cheaper storage
- **Compression**: Compress historical data

## 🔧 Maintenance & Operations

### Regular Maintenance Tasks
1. **Vacuum**: Regular VACUUM for space reclamation
2. **Analyze**: Update statistics for query optimization
3. **Backup**: Daily backups with point-in-time recovery
4. **Monitoring**: Database performance monitoring

### Backup Strategy
```bash
# Daily backup
pg_dump -U oaklandai_user -d oaklandai > daily_backup.sql

# Weekly full backup
pg_dumpall -U oaklandai_user > weekly_full_backup.sql

# Point-in-time recovery setup
# (Requires WAL archiving configuration)
```

### Monitoring Queries
```sql
-- Database size monitoring
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Connection monitoring
SELECT 
    state,
    COUNT(*) as connection_count
FROM pg_stat_activity 
GROUP BY state;
```

## 📋 Implementation Checklist

### ✅ Completed
- [x] Database schema design
- [x] Table creation and relationships
- [x] Index creation for performance
- [x] Triggers and functions
- [x] Admin user setup
- [x] Environment configuration
- [x] Connection testing

### 🔄 Future Enhancements
- [ ] Read replica setup for analytics
- [ ] Automated backup system
- [ ] Performance monitoring dashboard
- [ ] Data archiving strategy
- [ ] Advanced analytics views
- [ ] Real-time analytics pipeline

---

**Database Version**: PostgreSQL 15.13
**Last Updated**: July 20, 2025
**Status**: ✅ Production Ready 