# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ExFiles is an AI-powered document management and chat application built with Next.js 16 (App Router) and React 19. Users can upload documents, get AI-generated summaries, manage documents by categories, and interact with an AI chat assistant.

## Commands

```bash
# Development (runs on port 5000 with increased memory)
npm run dev

# Production build
npm run build

# Start production server (port 5000)
npm start

# Linting (ESLint 9 flat config)
npm run lint

# Format code
npm run format
```

## Architecture

### Directory Structure

- `app/(pages)/` - Route pages using Next.js route groups
  - Auth: login, signup, forgot-password, new-password, quick-verification, account-created
  - Documents: documents, upload-doc, download-doc-report
  - Chat: ai-chats (with dynamic `[threadId]` route)
  - Payments: plans, order-summary, payment-successful, payment-failed, payment-pending
- `app/components/` - React components organized by feature
- `app/redux/` - Redux Toolkit store with redux-persist
- `app/services/` - WebSocket service for real-time chat
- `app/utils/` - Axios config, API endpoints, validation schemas, constants
- `app/providers/` - ThemeRegistry (MUI), GoogleOAuthWrapper

### State Management

Redux Toolkit with redux-persist. Store: `app/redux/store.ts`

Key slices (in `app/redux/slices/`):
- `Chat/` - Thread management, messages, WebSocket message handling
- `login/` - User authentication state (persisted)
- `register/` - Registration state (persisted)
- `fileUpload/` - Document upload state with chunked upload support
- `documentSummary/`, `documentByCategory/`, `categoryListing/` - Document management

Only `login` and `register` slices are persisted; all others are blacklisted.

Use typed hooks from `app/redux/hooks.ts`:
```typescript
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
```

### Path Aliases (tsconfig.json)

```typescript
@/*           -> ./*
@components/* -> app/components/*
@store/*      -> app/redux/*
@services/*   -> app/services/*
```

### API Layer

- Axios instance with interceptors: `app/utils/axiosConfig.ts`
- API endpoints: `app/utils/apiEndPoints/urlMapper.ts`
- Base URL from `NEXT_PUBLIC_API_BASE_URL`
- Auth: Token-based (`Token <token>` header), auto-logout on 401

### WebSocket

Real-time chat via WebSocket (`app/services/WebSocketService.ts`):
- Initialize: `initWebSocketStore(dispatch)` then `WebSocketService()`
- Send messages: `sendSocketMessage(payload)`
- Disconnect: `disconnectSocket()`
- Socket URL from `NEXT_PUBLIC_SOCKET_URL`
- Auth via subprotocol: `['authorization', token]`
- Auto-reconnect with linear backoff (max 5 attempts)

### AI Chat Module

Located in `app/components/AI-Chat-Module/`:
- `chat-home-screen/` - Initial chat interface with prompt suggestions
- `chat-conversation-screen/` - Thread conversation with streaming responses
- `common/chat-input-box/` - Unified chat input with drag-and-drop file upload
- `hooks/useChunkedFileUpload.tsx` - Chunked file upload hook
- `context/SearchContext.tsx` - Search state context

### Provider Hierarchy (app/layout.tsx)

```
ThemeProviderMode -> SearchProvider -> ClientAuthCheck -> GoogleOAuthWrapper -> ReduxProvider -> ThemeRegistry -> ToastProvider
```

### Environment Variables

Required:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL
- `NEXT_PUBLIC_SOCKET_URL` - WebSocket server URL
- `NEXT_PUBLIC_ENVIRONMENT_SERVER` - "production" enables analytics and cookie watcher
- `NEXT_PUBLIC_FETCH_TAG_IMAGES` - Image hostname for next/image
- `NEXT_PUBLIC_IMAGE_PATHNAME` - Image pathname pattern
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID

### Styling

- SCSS Modules (`.module.scss`) per component
- MUI v6 with Emotion
- Global styles in `app/globals.css`

### Configuration

- ESLint 9 flat config (`eslint.config.mjs`) with Next.js, React, React Hooks, TypeScript plugins
- Sentry integration in `next.config.mjs`
- Root `/` redirects to `/upload-doc`
