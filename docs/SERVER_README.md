# Server Application Documentation

## Overview

The server is a Node.js/Express backend application that provides RESTful API endpoints for the CareerForge platform. It handles authentication, resume management, ATS scoring, cover letter generation, document parsing, and administrative functions. The server uses MongoDB for data persistence and integrates with various third-party services for AI capabilities, file storage, and email services.

## Technology Stack

### Core Technologies
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web application framework
- **MongoDB** - NoSQL database (via Mongoose 8.14.0)
- **JWT** - Authentication tokens (jsonwebtoken 9.0.2)

### Key Libraries
- **Passport.js** - Authentication middleware (Google OAuth, LinkedIn OAuth)
- **bcrypt** - Password hashing
- **Mongoose** - MongoDB object modeling
- **Express Validator** - Request validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Winston** - Advanced logging
- **Multer** - File upload handling
- **Cloudinary** - Cloud-based image/file storage

### AI & Processing Services
- **Google Cloud Vertex AI** - AI model integration
- **Groq SDK** - AI inference
- **Hugging Face Inference** - AI models
- **Puppeteer** - Web scraping and PDF generation
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX parsing

### Additional Services
- **Nodemailer** - Email sending
- **Swagger** - API documentation
- **Express Rate Limit** - Rate limiting middleware

## Project Structure

```
server/
├── config/                 # Configuration files
│   ├── db-connect.js      # MongoDB connection
│   ├── logger.js          # Winston logger setup
│   ├── morgan.js          # Morgan logger config
│   ├── passport-setup.js  # Passport authentication config
│   ├── cloudinary-config.js
│   ├── email-config.js
│   └── cloudai-config.js
├── controller/            # Request handlers
│   ├── auth-controller.js
│   ├── resume-controller.js
│   ├── ats-score-controller.js
│   ├── cover-letter-controller.js
│   ├── template-controller.js
│   ├── feedback-controller.js
│   ├── admin-controller.js
│   ├── admin-analytics-controller.js
│   ├── ai-usage-controller.js
│   ├── resume-parser-controller.js
│   ├── text-extraction-controller.js
│   └── chat-controller.js
├── middleware/            # Express middleware
│   ├── admin-auth-middleware.js
│   ├── user-authorization.js
│   ├── err-handler.js
│   ├── request-validation.js
│   ├── upload-middleware.js
│   ├── document-upload-middleware.js
│   ├── tiered-rate-limit.js
│   ├── performance-logger.js
│   └── cost-monitor.js
├── model/                 # Mongoose models
│   ├── user-model.js
│   ├── resume-model.js
│   ├── template-model.js
│   ├── cover-letter-model.js
│   ├── feedback-model.js
│   ├── ai-usage-model.js
│   └── analytics-event-model.js
├── router/                # Route definitions
│   ├── index-router.js
│   ├── auth-router.js
│   ├── resume-router.js
│   ├── ats-score-router.js
│   ├── cover-letter-router.js
│   ├── template-router.js
│   ├── feedback-router.js
│   ├── admin-analytics-router.js
│   ├── ai-usage-router.js
│   ├── resume-parser-router.js
│   ├── text-extraction-router.js
│   └── chat-router.js
├── service/               # Business logic services
│   ├── resume-parser-service.js
│   ├── text-extraction-service.js
│   ├── ats-score-service.js
│   ├── ai-summary-service.js
│   ├── cloudinary-service.js
│   ├── email-verification-service.js
│   ├── password-reset-service.js
│   └── analytics-logger.js
├── util/                  # Utility functions
│   ├── jwt.js
│   ├── auth-cookie.js
│   ├── ai-usage-tracker.js
│   └── mail-verification.js
├── validators/            # Input validation schemas
│   ├── auth-validators.js
│   ├── resume-validators.js
│   ├── cover-letter-validators.js
│   └── template-validators.js
├── logs/                  # Application logs
├── app.js                 # Express app configuration
├── index.js               # Application entry point
├── Dockerfile             # Docker configuration
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/careerforge

# JWT & Security
JWT_SECRET=your_jwt_secret_here
COOKIE_SECRET=your_cookie_secret_here

# CORS
CLIENT_ORIGIN=http://localhost:5173

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@careerforge.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# AI Services
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_key
```

### Development

Start the development server with auto-reload:
```bash
npm run dev
```

Start the production server:
```bash
npm start
```

The server will be available at `http://localhost:5000` (or the port specified in `.env`).

### API Documentation

Swagger API documentation is available at:
```
http://localhost:5000/api-docs
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /verify-email/:token` - Email verification
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password
- `GET /google` - Google OAuth initiation
- `GET /google/callback` - Google OAuth callback
- `GET /linkedin` - LinkedIn OAuth initiation
- `GET /linkedin/callback` - LinkedIn OAuth callback

### Resumes (`/api/resumes`)
- `GET /` - Get user's resumes
- `POST /` - Create new resume
- `GET /:id` - Get resume by ID
- `PUT /:id` - Update resume
- `DELETE /:id` - Delete resume
- `POST /:id/duplicate` - Duplicate resume

### ATS Scoring (`/api/ats-score`)
- `POST /analyze` - Analyze resume for ATS compatibility
- `GET /history` - Get ATS score history

### Cover Letters (`/api/cover-letters`)
- `GET /` - Get user's cover letters
- `POST /` - Create new cover letter
- `GET /:id` - Get cover letter by ID
- `PUT /:id` - Update cover letter
- `DELETE /:id` - Delete cover letter
- `POST /generate` - Generate cover letter with AI

### Templates (`/api/templates`)
- `GET /` - Get available templates
- `GET /:id` - Get template by ID
- `POST /` - Create template (admin only)
- `PUT /:id` - Update template (admin only)
- `DELETE /:id` - Delete template (admin only)

### Document Processing (`/api/resume-parser`)
- `POST /parse` - Parse uploaded resume document
- `POST /extract-text` - Extract text from document

### Admin (`/api/admin`)
- `GET /users` - Get all users (admin only)
- `GET /analytics/*` - Analytics endpoints
- `GET /ai-usage` - AI usage statistics
- `GET /feedback` - User feedback

## Architecture Patterns

### MVC Pattern
The server follows the Model-View-Controller pattern:
- **Models**: Mongoose schemas in `model/`
- **Views**: JSON responses (RESTful API)
- **Controllers**: Request handlers in `controller/`

### Middleware Chain
Request flow through middleware:
1. Security (Helmet, CORS)
2. Body parsing (JSON, URL-encoded)
3. Cookie parsing
4. Logging (Morgan, Winston)
5. Performance monitoring
6. Rate limiting
7. Authentication (where required)
8. Validation
9. Route handlers
10. Error handling

### Error Handling
- Centralized error handler middleware
- Consistent error response format
- Error logging with Winston
- User-friendly error messages

### Authentication Flow
1. User credentials validated
2. JWT token generated
3. Token stored in HTTP-only cookie
4. Token verified on protected routes
5. User context attached to request

## Security Features

### Authentication & Authorization
- JWT-based authentication
- HTTP-only cookies for token storage
- Password hashing with bcrypt
- OAuth 2.0 integration (Google, LinkedIn)
- Role-based access control (admin/user)

### Security Middleware
- **Helmet**: Sets secure HTTP headers
- **CORS**: Configurable cross-origin policies
- **Rate Limiting**: Prevents abuse and DDoS
- **Input Validation**: Express Validator schemas
- **SQL Injection Prevention**: Mongoose parameterized queries

### Data Protection
- Password hashing (bcrypt with salt rounds)
- Sensitive data encryption
- Secure cookie configuration
- Environment variable protection

## Database Schema

### User Model
- Authentication credentials
- Profile information
- Email verification status
- OAuth provider links
- Role (user/admin)

### Resume Model
- Resume content (JSON structure)
- Template reference
- User association
- Metadata (created, updated dates)
- Version history

### Template Model
- Template structure
- Preview images
- Category and tags
- Admin-only fields

### AI Usage Model
- User ID
- Service used
- Tokens consumed
- Cost tracking
- Timestamp

## Logging

### Winston Logger
- File-based logging (daily rotation)
- Separate log files for app and errors
- Log levels: error, warn, info, http, debug
- Production: JSON format
- Development: Human-readable format

### Log Files
- `logs/app-YYYY-MM-DD.log` - General application logs
- `logs/error-YYYY-MM-DD.log` - Error logs

## Performance Optimization

### Caching
- Response caching for static data
- Database query optimization
- Indexed MongoDB queries

### Rate Limiting
- Global rate limiting (100 requests per 15 minutes)
- Tiered rate limiting for different user types
- Custom rate limit handlers with analytics

### Monitoring
- Performance logging middleware
- Request/response time tracking
- Cost monitoring for AI services

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment (development/production) | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `COOKIE_SECRET` | Cookie signing secret | Yes |
| `CLIENT_ORIGIN` | Allowed CORS origin | Yes |
| `CLOUDINARY_*` | Cloudinary credentials | Yes |
| `EMAIL_*` | Email service configuration | Yes |
| `GOOGLE_CLIENT_*` | Google OAuth credentials | No |
| `LINKEDIN_CLIENT_*` | LinkedIn OAuth credentials | No |
| `GROQ_API_KEY` | Groq API key | No |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | No |

## Docker Deployment

### Build Docker Image
```bash
docker build -t careerforge-server .
```

### Run Docker Container
```bash
docker run -p 5000:5000 --env-file .env careerforge-server
```

## Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Manual Testing
Use tools like Postman or curl to test endpoints:
```bash
# Login example
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env`
- Ensure network connectivity

**Port Already in Use:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

**JWT Token Issues:**
- Verify `JWT_SECRET` is set
- Check token expiration settings
- Ensure cookies are enabled

**File Upload Issues:**
- Check Cloudinary credentials
- Verify file size limits
- Check multer configuration

## Production Considerations

### Environment Setup
- Set `NODE_ENV=production`
- Use secure, randomly generated secrets
- Enable HTTPS
- Configure proper CORS origins
- Set up monitoring and alerting

### Performance
- Enable gzip compression
- Use reverse proxy (nginx)
- Set up load balancing
- Implement caching strategies
- Monitor database performance

### Security
- Regular security audits
- Keep dependencies updated
- Use environment variables for secrets
- Implement proper backup strategies
- Set up intrusion detection

## Additional Resources

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Contributing

When contributing to the server:
1. Follow the MVC pattern
2. Add input validation for all endpoints
3. Implement proper error handling
4. Write clear, descriptive commit messages
5. Update API documentation (Swagger)
6. Test endpoints thoroughly
7. Follow security best practices

