# Contributing to NovaAI University

## Deployment

To deploy the application, follow these steps:

1. Make sure all code changes are committed
2. Build the application:
   ```
   npm run build
   ```
3. Start the server in production mode:
   ```
   npm run start
   ```

### Deployment Configuration

The application uses the following configurations for deployment:

- Server configuration is in `server/index.ts`
- Static file serving is handled in `server/vite.ts`
- All routing for the SPA is configured to redirect to `index.html`
- Service Worker is set up for offline functionality
- PWA manifest is configured in `public/manifest.json`

## Development

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

- `client/` - Frontend application code
- `server/` - Backend server and API code
- `shared/` - Shared types and utilities
- `public/` - Static assets and public files