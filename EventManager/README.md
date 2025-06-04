# Event Management System - Frontend

A modern React-based frontend application for managing events. Built with Vite, React, and TailwindCSS.

## Features

- User authentication and registration
- Event creation and management
- Responsive design
- Form validation using Formik and Yup
- Modern UI with TailwindCSS
- Toast notifications
- Protected routes

## Tech Stack

- React (v19)
- Vite
- TailwindCSS
- React Router DOM
- Axios for API calls
- Formik & Yup for form handling
- React Hot Toast for notifications
- Lucide React for icons

## Project Structure

```
EventManager/
├── src/           # Source files
├── components/    # Reusable UI components
├── contexts/      # React context providers
├── utils/         # Utility functions
├── public/        # Static assets
└── index.html     # Entry HTML file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend service running (see backend README)

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd EventManager
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will start running on `http://localhost:5173` by default.

Other available scripts:
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Building for Production

To create a production build:

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

## Features Overview

1. **Authentication**
   - User registration
   - User login
   - Protected routes

2. **Event Management**
   - Create new events
   - View event details
   - Event image upload

3. **UI/UX**
   - Responsive design
   - Toast notifications
   - Form validation
   - Loading states
   - Error handling

## Browser Support

The application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
