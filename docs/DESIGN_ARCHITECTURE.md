# Design & Architecture Documentation

## Overview

CareerForge is a comprehensive career management platform that helps users create, optimize, and manage their resumes and cover letters. The platform leverages AI technologies to provide ATS (Applicant Tracking System) scoring, document parsing, and intelligent content generation.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ React SPA     │  │ State Mgmt    │  │ API Client   │       │
│  │ (Vite)        │  │ (Context API) │  │ (Axios)      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Express       │  │ Middleware   │  │ Auth         │       │
│  │ Server        │  │ (Security)   │  │ (JWT/OAuth)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌─────────▼─────────┐  ┌───────▼────────┐
│  BUSINESS      │  │  AI SERVICES      │  │  FILE          │
│  LOGIC         │  │  LAYER            │  │  STORAGE       │
│  (Controllers) │  │                   │  │  (Cloudinary)  │
└───────┬────────┘  └─────────┬─────────┘  └───────┬────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                    DATA LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ MongoDB       │  │ File Storage │  │ Cache        │     │
│  │ (Documents)   │  │ (Cloudinary) │  │ (Future)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Architecture
- **Framework**: React 18 with Vite
- **State Management**: React Context API
- **Routing**: React Router DOM v7
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Form Management**: React Hook Form + Zod
- **HTTP Client**: Axios with interceptors
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics 4

### Backend Architecture
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js (OAuth)
- **File Storage**: Cloudinary
- **AI Services**: Google Vertex AI, Groq, Hugging Face
- **Document Processing**: Puppeteer, pdf-parse, mammoth
- **Email**: Nodemailer
- **Logging**: Winston + Morgan
- **API Docs**: Swagger/OpenAPI

## Core Features & Design

### 1. Authentication System

#### Architecture
- **JWT-based authentication** with HTTP-only cookies
- **OAuth 2.0** integration (Google, LinkedIn)
- **Email verification** workflow
- **Password reset** flow with secure tokens

#### Flow Diagram
```
User Registration/Login
    ↓
Credentials Validation
    ↓
JWT Token Generation
    ↓
Token Stored in HTTP-only Cookie
    ↓
Protected Route Access
    ↓
Token Verification Middleware
    ↓
User Context Attached to Request
```

#### Security Features
- Password hashing with bcrypt (salt rounds)
- Token expiration and refresh
- CSRF protection via same-site cookies
- Rate limiting on auth endpoints

### 2. Resume Management System

#### Data Model
```javascript
Resume {
  userId: ObjectId,
  title: String,
  content: {
    personalInfo: Object,
    experience: Array,
    education: Array,
    skills: Array,
    // ... flexible JSON structure
  },
  templateId: ObjectId,
  metadata: {
    createdAt: Date,
    updatedAt: Date,
    version: Number
  }
}
```

#### Features
- **Rich Text Editor**: WYSIWYG editing with formatting options
- **Template System**: Multiple professional templates
- **Version Control**: Resume history and versioning
- **Export**: PDF generation with custom styling
- **Parsing**: Extract data from uploaded documents (PDF, DOCX)

#### Architecture Pattern
- **CRUD Operations**: Standard RESTful endpoints
- **State Management**: Context API for resume editor state
- **Optimistic Updates**: Immediate UI feedback
- **Offline Support**: Local storage for draft saving

### 3. ATS Scoring System

#### Architecture
```
Resume Input
    ↓
Text Extraction & Normalization
    ↓
Keyword Analysis
    ↓
Format Analysis
    ↓
Section Structure Analysis
    ↓
AI-Powered Scoring
    ↓
Detailed Feedback Generation
    ↓
Score & Recommendations
```

#### Scoring Factors
1. **Keyword Matching**: Job description keywords vs resume
2. **Format Compliance**: ATS-friendly formatting
3. **Section Completeness**: Required sections present
4. **Content Quality**: AI analysis of content relevance
5. **Readability**: Structure and organization

#### AI Integration
- Uses Google Vertex AI (Gemini) for content analysis
- Natural language processing for keyword extraction
- Contextual understanding of resume content

### 4. Cover Letter Generation

#### Architecture
```
User Input (Job Description, Resume Selection)
    ↓
Template Selection
    ↓
AI Content Generation
    ↓
Personalization
    ↓
Preview & Editing
    ↓
Export (PDF/Text)
```

#### AI Generation Flow
1. Extract key information from job description
2. Match relevant resume sections
3. Generate personalized content using AI
4. Apply template formatting
5. Allow user customization

### 5. Document Processing

#### Supported Formats
- **PDF**: pdf-parse library
- **DOCX**: mammoth library
- **Images**: OCR capabilities (future)

#### Processing Pipeline
```
Document Upload
    ↓
File Validation (type, size)
    ↓
Format Detection
    ↓
Text Extraction
    ↓
Structure Analysis
    ↓
Data Normalization
    ↓
Resume Data Extraction
    ↓
Validation & Mapping
    ↓
Resume Creation
```

### 6. Admin Dashboard

#### Features
- **User Management**: View, manage users
- **Analytics**: Usage statistics, user behavior
- **Template Management**: Create, edit, delete templates
- **AI Usage Tracking**: Monitor AI service consumption
- **Feedback Management**: Review user feedback
- **Security Monitoring**: Track security events

#### Analytics Architecture
```
Event Tracking
    ↓
Analytics Logger Service
    ↓
MongoDB (Analytics Events Collection)
    ↓
Aggregation Pipeline
    ↓
Dashboard Visualization
```

## Design Patterns

### 1. MVC Pattern (Backend)
- **Models**: Mongoose schemas define data structure
- **Views**: JSON API responses
- **Controllers**: Handle business logic and request/response

### 2. Service Layer Pattern
- Business logic separated from controllers
- Reusable services across different endpoints
- Easier testing and maintenance

### 3. Middleware Pattern
- Request processing pipeline
- Reusable middleware functions
- Error handling, authentication, validation

### 4. Context API Pattern (Frontend)
- Global state management without Redux
- Provider components wrap application
- Consumer hooks for accessing state

### 5. Custom Hooks Pattern
- Reusable logic encapsulation
- Separation of concerns
- Testable business logic

## Data Flow

### User Registration Flow
```
1. User submits registration form
2. Frontend validates input (Zod)
3. API call to /api/auth/register
4. Backend validates and hashes password
5. User document created in MongoDB
6. Verification email sent
7. User verifies email
8. Account activated
```

### Resume Creation Flow
```
1. User selects template
2. Frontend loads template structure
3. User fills in resume content
4. Auto-save to local storage
5. User clicks "Save"
6. API call to /api/resumes
7. Resume saved to MongoDB
8. Success response with resume ID
9. UI updates with saved resume
```

### ATS Scoring Flow
```
1. User uploads resume or selects existing
2. Optionally provides job description
3. API call to /api/ats-score/analyze
4. Backend extracts resume text
5. AI service analyzes content
6. Scoring algorithm calculates score
7. Feedback generated
8. Results saved to database
9. Response sent to frontend
10. Results displayed with visualizations
```

## Security Architecture

### Authentication Security
- **JWT Tokens**: Signed with secret, expiration time
- **HTTP-only Cookies**: Prevents XSS attacks
- **Same-site Cookies**: CSRF protection
- **Password Hashing**: bcrypt with salt

### API Security
- **Helmet.js**: Security headers
- **CORS**: Configured allowed origins
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Express Validator
- **SQL Injection Prevention**: Mongoose parameterized queries

### Data Security
- **Environment Variables**: Sensitive data in .env
- **Encryption**: Sensitive data encrypted at rest
- **Access Control**: Role-based permissions
- **Audit Logging**: Security events logged

## Scalability Considerations

### Current Architecture
- Monolithic backend (Express)
- Single MongoDB instance
- File storage on Cloudinary

### Future Scalability Options
1. **Microservices**: Split services (auth, resume, AI)
2. **Load Balancing**: Multiple server instances
3. **Database Sharding**: Distribute MongoDB data
4. **Caching Layer**: Redis for session/data caching
5. **CDN**: Static asset delivery
6. **Queue System**: Background job processing

## Performance Optimization

### Frontend
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Lazy loading, compression
- **Caching**: Browser caching strategies
- **Bundle Optimization**: Tree shaking, minification

### Backend
- **Database Indexing**: Optimized queries
- **Response Caching**: Cache frequently accessed data
- **Connection Pooling**: MongoDB connection management
- **Async Operations**: Non-blocking I/O

## Error Handling

### Frontend Error Handling
- **Error Boundaries**: React error boundaries
- **Sentry Integration**: Error tracking and reporting
- **User-friendly Messages**: Clear error communication
- **Retry Logic**: Automatic retry for failed requests

### Backend Error Handling
- **Centralized Handler**: Express error middleware
- **Structured Responses**: Consistent error format
- **Logging**: Winston error logging
- **Graceful Degradation**: Fallback mechanisms

## API Design Principles

### RESTful Conventions
- **Resource-based URLs**: `/api/resumes`, `/api/users`
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: Proper HTTP status codes
- **JSON Responses**: Consistent response format

### Response Format
```json
{
  "status": 200,
  "data": { ... },
  "message": "Success"
}
```

### Error Response Format
```json
{
  "status": 400,
  "error": "Error message",
  "details": { ... }
}
```

## Deployment Architecture

### Development
- Local MongoDB instance
- Development server (Vite)
- Environment variables in .env

### Production
- **Hosting**: Cloud platform (AWS, GCP, Azure)
- **Database**: MongoDB Atlas (cloud)
- **File Storage**: Cloudinary
- **CDN**: For static assets
- **Monitoring**: Application monitoring tools
- **CI/CD**: Automated deployment pipeline

## Future Enhancements

### Planned Features
1. **Real-time Collaboration**: Multiple users editing
2. **AI Avatar Interviews**: Mock interview system
3. **Job Matching**: AI-powered job recommendations
4. **Portfolio Builder**: Personal portfolio website
5. **Analytics Dashboard**: User engagement metrics

### Technical Improvements
1. **TypeScript Migration**: Type safety
2. **GraphQL API**: Flexible data fetching
3. **WebSocket Support**: Real-time features
4. **Progressive Web App**: Offline support
5. **Mobile App**: React Native application

## Integration Points

### Third-Party Services
- **Google Cloud**: Vertex AI, OAuth
- **Cloudinary**: File storage and processing
- **Email Service**: SMTP via Nodemailer
- **Analytics**: Google Analytics 4
- **Error Tracking**: Sentry

### API Integrations
- **AI Services**: Google Vertex AI, Groq, Hugging Face
- **OAuth Providers**: Google, LinkedIn
- **Document Processing**: pdf-parse, mammoth

## Monitoring & Observability

### Logging
- **Winston**: Structured logging
- **Morgan**: HTTP request logging
- **Log Rotation**: Daily log files
- **Log Levels**: Error, warn, info, debug

### Metrics
- **Performance**: Request/response times
- **Usage**: API endpoint usage
- **Errors**: Error rates and types
- **AI Costs**: Token consumption tracking

## Best Practices

### Code Organization
- **Separation of Concerns**: Clear module boundaries
- **DRY Principle**: Don't repeat yourself
- **Single Responsibility**: One purpose per module
- **Consistent Naming**: Clear, descriptive names

### Development Workflow
- **Version Control**: Git with feature branches
- **Code Review**: Peer review process
- **Testing**: Unit and integration tests
- **Documentation**: Inline and external docs

### Security Best Practices
- **Input Validation**: Validate all inputs
- **Output Encoding**: Prevent XSS
- **Least Privilege**: Minimal required permissions
- **Regular Updates**: Keep dependencies updated

## Conclusion

This architecture provides a scalable, maintainable foundation for the CareerForge platform. The separation of concerns, use of modern technologies, and adherence to best practices ensure the system can grow and adapt to future requirements while maintaining high performance and security standards.

