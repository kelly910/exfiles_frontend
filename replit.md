# ExFiles Frontend

## Overview
This is a Next.js 14 TypeScript application for ExFiles, a document management and AI chat platform. The application features user authentication, document upload/management, AI chat functionality, and payment processing.

## Recent Changes
- **2025-09-23**: Initial Replit setup completed
  - Configured Next.js dev server to bind to 0.0.0.0:5000
  - Set up workflow for development server
  - Configured deployment for autoscale hosting
  - Fixed image remote patterns configuration
  - Added memory optimization for Node.js

## Project Architecture
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit with Redux Persist
- **Authentication**: JWT tokens with middleware protection
- **Monitoring**: Sentry integration
- **Styling**: SCSS modules + global CSS

## Key Features
- User authentication (login/signup)
- Document upload and management
- AI chat functionality
- Payment processing
- Multi-plan subscription system
- Device limit management
- Dark/light theme support

## Environment Configuration
- Development server runs on port 5000
- Production deployment configured for autoscale
- Requires environment variables for:
  - Image remote patterns
  - Sentry configuration
  - API endpoints
  - Google OAuth

## Development
- Run `npm run dev` to start development server
- Application redirects from `/` to `/upload-doc`
- Unauthenticated users are redirected to `/login`
- Authenticated users can access all protected routes

## Notes
- The application uses middleware for route protection
- Large bundle size due to comprehensive feature set
- Some CSS warnings about autoprefixer compatibility (non-critical)
- Application requires proper environment variables for full functionality