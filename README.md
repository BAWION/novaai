# NovaAI University - AI Educational Platform

NovaAI University is an advanced AI-powered educational platform that revolutionizes personalized learning through intelligent technologies and interactive experiences, focusing on practical skill development and engaging user journeys.

## Features

- **Skills DNA System**: Multi-stage diagnostic assessment with radar chart visualization
- **AI-Powered Tutoring**: OpenAI GPT-4o integration for personalized learning
- **Comprehensive Course Library**: 9+ complete courses covering AI, Python, No-Code automation
- **LabHub**: Interactive laboratory for ML and Data Science practice
- **Community Integration**: Telegram channel integration with real-time updates
- **Progress Tracking**: Real-time lesson completion and skills progression monitoring

## Technology Stack

- **Frontend**: React 18 with TypeScript, Vite build system
- **UI**: Radix UI with shadcn/ui design system, Tailwind CSS
- **Backend**: Node.js with Express.js, TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4o, Anthropic Claude SDK
- **Deployment**: Vercel (frontend) + Replit (API)

## Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Production Deployment on Vercel

1. Fork this repository
2. Connect to Vercel
3. Add Environment Variables:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
4. Deploy automatically

## Architecture

The platform uses a hybrid deployment strategy:
- **Frontend**: Deployed on Vercel for global CDN performance
- **API**: Hosted on Replit for backend services
- **Database**: PostgreSQL with connection pooling
- **API Proxy**: All `/api/*` requests are proxied to the Replit backend

## Courses Available

1. **AI Literacy 101** - Introduction to artificial intelligence
2. **Advanced Prompt Engineering** - Master prompt techniques
3. **AI Ethics and Society** - Responsible AI development
4. **Python Programming Basics** - Complete Python course
5. **No-Code AI Solutions** - Build AI without programming
6. **Make.com + ChatGPT Automation** - Advanced workflow automation
7. **Telegram Bots on Replit** - Bot development without code

## Skills DNA System

The platform includes an innovative Skills DNA diagnostic system that:
- Assesses 8 core AI competencies across 7 stages
- Provides personalized learning recommendations
- Tracks progress with radar chart visualizations
- Updates automatically after each lesson completion

## Environment Variables

Required for production:
```
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
NODE_ENV=production
```

## Build Configuration

The project is configured for Vercel deployment with:
- Build command: `npm run build`
- Output directory: `dist/public`
- Framework: Vite
- API proxying to Replit backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software developed for NovaAI University educational platform.

## Support

For technical support or questions about the platform, please contact the development team.