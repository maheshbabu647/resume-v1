# Client Application Documentation

## Overview

The client is a modern React application built with Vite, providing a comprehensive resume and career management platform. It features a responsive UI built with Tailwind CSS and shadcn/ui components, offering users tools for resume creation, ATS scoring, cover letter generation, and more.

## Technology Stack

### Core Technologies
- **React 18.2.0** - UI library
- **Vite 6.3.1** - Build tool and dev server
- **React Router DOM 7.5.3** - Client-side routing
- **Tailwind CSS 4.1.7** - Utility-first CSS framework

### Key Libraries
- **Axios 1.9.0** - HTTP client for API communication
- **React Hook Form 7.56.4** - Form management
- **Zod 3.25.32** - Schema validation
- **Framer Motion 12.15.0** - Animation library
- **Radix UI** - Accessible component primitives
- **Sentry** - Error tracking and monitoring
- **React GA4** - Google Analytics integration

### UI Components
- **shadcn/ui** - Component library built on Radix UI
- **Lucide React** - Icon library
- **Recharts** - Chart library for analytics

## Project Structure

```
client/
├── public/                 # Static assets
│   ├── logo.JPG
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── api/               # API service layer
│   │   ├── index.js       # Axios instance configuration
│   │   ├── authServiceApi.js
│   │   ├── resumeServiceApi.js
│   │   ├── atsScoreServiceApi.js
│   │   ├── coverLetterServiceApi.js
│   │   ├── templateServiceApi.js
│   │   ├── feedbackServiceApi.js
│   │   ├── adminServiceApi.js
│   │   ├── resumeParserServiceApi.js
│   │   └── textExtractionServiceApi.js
│   ├── components/        # Reusable UI components
│   │   ├── Common/        # Shared components
│   │   ├── ResumeEditor/  # Resume editor components
│   │   ├── Auth/          # Authentication components
│   │   └── ui/            # shadcn/ui components
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── ResumeContext.jsx
│   │   ├── TemplateContext.jsx
│   │   ├── CoverLetterContext.jsx
│   │   └── index.js
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useFormHandlers.js
│   │   ├── useResumeEditorState.jsx
│   │   └── ...
│   ├── pages/             # Page-level components
│   │   ├── Auth/          # Authentication pages
│   │   ├── Resume/        # Resume management pages
│   │   ├── CoverLetter/   # Cover letter pages
│   │   ├── ATSChecker/    # ATS scoring pages
│   │   ├── Admin/         # Admin dashboard pages
│   │   └── General/       # General pages (Home, Dashboard, etc.)
│   ├── routes/            # Route configuration
│   │   └── AppRouter.jsx
│   ├── utils/             # Utility functions
│   │   ├── EditorUtils.js
│   │   └── ...
│   ├── lib/               # Third-party configurations
│   │   └── utils.js
│   ├── assets/            # Images, logos, etc.
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── eslint.config.js      # ESLint configuration
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory with the following variables:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_GA_MEASUREMENT_ID=your_ga_id_here
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Building for Production

Build the production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Key Features

### Authentication
- User registration and login
- Email verification
- Password reset functionality
- OAuth integration (Google, LinkedIn)
- Protected routes with authentication guards

### Resume Management
- Rich text resume editor
- Multiple resume templates
- Resume preview and export (PDF)
- Resume parsing from uploaded documents
- Resume versioning and history

### ATS Scoring
- Automated ATS compatibility scoring
- Detailed feedback and recommendations
- Keyword analysis
- Format optimization suggestions

### Cover Letter Generation
- AI-powered cover letter generation
- Template-based cover letters
- Customizable content
- Preview and export functionality

### Admin Dashboard
- User management
- Analytics and reporting
- Template management
- AI usage tracking
- Security monitoring

## Code Organization Patterns

### API Services
All API calls are centralized in the `src/api/` directory. Each service file handles a specific domain:
- Uses a shared Axios instance with interceptors
- Consistent error handling
- Request/response transformation
- Authentication token management

### Component Structure
- **Pages**: Top-level route components
- **Components**: Reusable UI components organized by feature
- **Common**: Shared components used across features
- **UI**: Base components from shadcn/ui

### State Management
- **Context API**: Used for global state (Auth, Resume, Templates, Cover Letters)
- **React Hook Form**: Form state management
- **Local State**: Component-specific state with useState/useReducer

### Custom Hooks
Custom hooks encapsulate reusable logic:
- `useAuth` - Authentication state and methods
- `useFormHandlers` - Form submission and validation
- `useResumeEditorState` - Resume editor state management

## Styling

### Tailwind CSS
The project uses Tailwind CSS for styling with:
- Custom color palette
- Responsive design utilities
- Dark mode support (if configured)
- Custom animations and transitions

### Component Styling
- Utility-first approach with Tailwind classes
- shadcn/ui components for consistent design system
- CSS modules for component-specific styles (if needed)

## Error Handling

### Error Boundaries
- React Error Boundaries for component-level error catching
- Sentry integration for error tracking and reporting

### API Error Handling
- Centralized error handling in API service layer
- User-friendly error messages
- Network error handling
- Retry logic for failed requests

## Performance Optimization

### Code Splitting
- Route-based code splitting with React.lazy
- Component lazy loading with @loadable/component
- Dynamic imports for heavy dependencies

### Image Optimization
- Lazy loading with react-lazy-load-image-component
- Image optimization and compression
- Responsive images

### Caching
- API response caching where appropriate
- Browser caching strategies
- Service worker for offline support (if implemented)

## Testing

### Linting
Run ESLint to check code quality:
```bash
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | No |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID | No |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

### Code Style
- Follow ESLint rules
- Use functional components with hooks
- Prefer named exports
- Use TypeScript-style JSDoc comments

### Component Guidelines
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking
- Follow the single responsibility principle

### Git Workflow
- Create feature branches from main
- Write descriptive commit messages
- Keep commits atomic and focused

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use a different port
npm run dev -- --port 3000
```

**Build cache issues:**
```bash
npm run build:clean
# Or
npm run dev:no-cache
```

**Dependency issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [React Router Documentation](https://reactrouter.com/)

## Contributing

When contributing to the client application:
1. Follow the code organization patterns
2. Write clear, descriptive commit messages
3. Test your changes thoroughly
4. Update documentation as needed
5. Ensure ESLint passes without errors

