# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack to-do list application with a Node.js/Express backend and vanilla JavaScript frontend. The app uses JSON file storage for data persistence and is deployed on Vercel.

## Architecture

### Frontend-Backend Communication
- Frontend (`todo-list.html`) makes fetch requests to REST API endpoints
- API URL is relative (`/api/tasks`) to work in both local and production environments
- All CRUD operations are asynchronous and include error handling with user alerts

### Data Flow
1. Frontend initializes and loads tasks via `GET /api/tasks`
2. User actions trigger API calls (POST/PUT/DELETE)
3. Server reads/writes to `tasks.json` file synchronously
4. Frontend updates UI after successful API responses

### Storage Pattern
- `tasks.json` stores an array of task objects: `{ id: Number, text: String, completed: Boolean }`
- File operations use synchronous `fs` methods in `server.js`
- Server creates empty `tasks.json` if it doesn't exist
- Task IDs are generated using `Date.now()` timestamps

### Vercel Deployment Specifics
- `vercel.json` routes all requests through `server.js` as a serverless function
- Root route (`/`) explicitly serves `todo-list.html` via `res.sendFile()`
- All routes (including static files) pass through Express, not native Vercel static serving

## Development Commands

### Local Development
```bash
npm install          # Install dependencies
npm start           # Start server on localhost:3000
npm run dev         # Alias for npm start
```

Access the app at `http://localhost:3000/` (root serves todo-list.html)

### API Testing
The REST API can be tested directly:
```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Create a task
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"text":"Test task"}'

# Update a task
curl -X PUT http://localhost:3000/api/tasks/1234567890 -H "Content-Type: application/json" -d '{"completed":true}'

# Delete a task
curl -X DELETE http://localhost:3000/api/tasks/1234567890
```

## Important Implementation Details

### API Endpoint Order Matters
The root route handler (`app.get('/')`) must come AFTER all `/api/*` routes in `server.js` to avoid conflicts.

### Environment Differences
- **Local**: Server runs continuously on port 3000
- **Vercel**: Each request spawns a serverless function instance; file writes may not persist across cold starts (Vercel's ephemeral filesystem)

### File System Considerations
When modifying `tasks.json` storage, be aware that Vercel's serverless environment has an ephemeral filesystem. For production, consider migrating to a database or Vercel's data storage solutions if data persistence issues arise.

## Key Files

- `server.js` - Express app with API routes and root handler (line 120: root route serves todo-list.html)
- `todo-list.html` - Complete frontend (HTML/CSS/JS in one file, API_URL defined at line 198)
- `tasks.json` - Data storage (git-tracked, contains current task state)
- `vercel.json` - Deployment config (routes everything through server.js)
- `todo-list-requirements.md` - Full requirements specification

## Git Configuration

This repository uses:
- Git user: "Shriram Bhandari" <sbhandari@entrata.com>
- Remote: https://github.com/shrirambhandari1/ai-bootcamp.git
- Main branch: `main`
