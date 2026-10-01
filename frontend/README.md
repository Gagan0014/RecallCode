# RecallCode Frontend

A React + Vite frontend for RecallCode - Spaced Repetition System for LeetCode

## Features

- 🔐 Secure authentication with JWT
- 📊 Interactive dashboard with stats
- 🔄 Spaced repetition review session
- 📋 Problem management and tracking
- ⚙️ User settings and preferences
- 🎨 Clean, responsive UI with Tailwind CSS

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:8000/api
```

3. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── api/              # API integration
│   ├── axiosConfig.js
│   ├── auth.js
│   └── problems.js
├── components/       # Reusable components
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/          # Context API
│   └── AuthContext.jsx
├── pages/            # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Review.jsx
│   ├── Problems.jsx
│   ├── AddProblem.jsx
│   └── Settings.jsx
├── App.jsx           # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Available Scripts

### `npm run dev`
Runs the app in development mode.

### `npm run build`
Builds the app for production.

### `npm run preview`
Preview the production build locally.

## Key Features

### Dashboard
- View statistics (total problems, due today, completed)
- See problems due for review
- Quick access to start review session

### Review Session
- Spaced repetition review interface
- Rate problems using SM-2 algorithm (0-5 scale)
- Track progress with progress bar
- Navigation between problems

### Problems Management
- View all tracked problems
- Filter by difficulty level
- Add new problems
- Delete problems
- Direct link to LeetCode problems

### Settings
- Update profile information
- Set LeetCode username for syncing
- Configure daily review limit
- Set email reminder time and timezone

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token automatically attached to all API requests
5. Protected routes check for valid token
6. If token expires (401), user redirected to login

## API Integration

All API calls are configured in `/api/` folder:

- **auth.js** - Authentication endpoints
- **problems.js** - Problem management endpoints
- **axiosConfig.js** - Axios configuration with interceptors

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder ready for deployment.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000/api` | Backend API base URL |

## Troubleshooting

### API Connection Issues

1. Ensure backend is running on port 8000
2. Check CORS is enabled on backend
3. Verify `VITE_API_URL` is correct
4. Check browser console for detailed errors

### Authentication Issues

1. Clear localStorage: `localStorage.clear()`
2. Check token expiration
3. Verify backend JWT_SECRET matches
4. Check Authorization header format

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT
