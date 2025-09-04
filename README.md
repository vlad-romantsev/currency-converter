# Currency Converter

A responsive currency conversion web application built with React + TypeScript, featuring real-time exchange rates with caching and offline support.

## Features

- Real-time currency conversion using live exchange rates
- Support for both desktop (≥1024px) and mobile (≤480px) devices
- Offline functionality with cached rates
- Searchable currency selection modal
- Keyboard navigation support
- PWA capabilities for mobile installation

## Live Demo

The application is deployed and available online via **Vercel**:  
👉 [https://currency-converter-liard-two.vercel.app/](https://currency-converter-liard-two.vercel.app/)

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create environment file: `cp .env.example .env`
4. Configure your API settings in `.env`:
```
VITE_API_BASE_URL=https://api.vatcomply.com
VITE_CACHE_EXPIRE_MINUTES=5
```
5. Start development server: `npm run dev`

## API Configuration

This application supports multiple exchange rate APIs:

1. **VATComply** (default): Free API with EUR as base currency
2. **fxratesapi.com**: Requires API key (set `VITE_API_KEY` in .env)

## Architecture Decisions

- **State Management**: React hooks with localStorage persistence
- **Caching Strategy**: 5-minute cache expiration with background refresh
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: React.memo, useMemo, and useCallback for optimization
- **Offline Support**: Service Workers and cached API responses

## Building for Production

1. Build: `npm run build`
2. Preview: `npm run preview`

## Browser Support

Supports all modern browsers with ES2015+ support