# To-Do List Application

A simple, modern to-do list web application with persistent storage.

## Features

- Add, edit, and delete tasks
- Mark tasks as complete/incomplete
- Data persists to JSON file storage
- Clean, responsive UI with gradient design
- RESTful API backend

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Storage**: JSON file storage
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shrirambhandari1/ai-bootcamp.git
cd ai-bootcamp
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Deployment

This application is configured for deployment on Vercel.

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect the configuration from `vercel.json`
4. Deploy!

## Project Structure

```
.
├── server.js                  # Express server and API routes
├── todo-list.html            # Frontend application
├── tasks.json                # Data storage file
├── package.json              # Node.js dependencies
├── vercel.json               # Vercel deployment configuration
├── todo-list-requirements.md # Requirements documentation
└── README.md                 # This file
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
