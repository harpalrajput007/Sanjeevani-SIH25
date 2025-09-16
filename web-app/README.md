# Herb Trace Web Application

## Overview
Modern, responsive web application for blockchain-based herb traceability system built with Next.js and Tailwind CSS.

## Features

### 🔐 Authentication & Roles
- Role-based login (Farmer/Manufacturer)
- Persistent authentication state
- Protected routes

### 👨‍🌾 Farmer Features
- Register new herb batches with image upload
- GPS location capture (auto-detect or manual)
- View all registered batches
- Search and filter batches

### 🏭 Manufacturer Features
- View all system batches
- Update batch status throughout supply chain
- Generate QR codes for consumer traceability
- Analytics dashboard with system metrics

### 👥 Public Features
- QR code scanning for batch verification
- Complete supply chain timeline
- Blockchain verification
- IPFS image viewing

## Components

### Layout Components
- `Layout.js` - Main layout with navigation
- `LoadingSpinner.js` - Reusable loading indicator
- `StatsCard.js` - Metrics display cards

### Feature Components
- `BatchCard.js` - Batch display with status indicators
- `StatusTimeline.js` - Visual status history timeline

## Pages

- `/` - Login with role selection
- `/dashboard` - Main dashboard with batch listing
- `/register-batch` - Batch registration form (farmers only)
- `/batch/[id]` - Detailed batch view with status updates
- `/analytics` - System analytics and metrics
- `/trace` - Public traceability page (QR code destination)

## UI/UX Features

### Design System
- Consistent color scheme (Green primary, status-based colors)
- Responsive grid layouts
- Hover states and transitions
- Loading states and error handling

### User Experience
- Search functionality across batches
- Visual status indicators
- Drag-and-drop file upload
- One-click location detection
- Mobile-responsive design

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast colors

## Technology Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Routing**: Next.js App Router
- **Icons**: Unicode emojis for lightweight design
- **QR Codes**: qrcode library

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Setup

The application connects to the backend API at `http://localhost:3001` by default. Update the `API_BASE_URL` constant in each page file for different environments.

## Responsive Design

- **Mobile**: Single column layout, stacked navigation
- **Tablet**: Two-column grid, horizontal navigation
- **Desktop**: Three-column grid, full navigation bar

## Performance Optimizations

- Static generation for public pages
- Image optimization with Next.js
- Component-based architecture for reusability
- Efficient state management
- Lazy loading for large datasets