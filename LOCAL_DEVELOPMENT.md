# Local Development Guide for One In One

This guide will help you set up and run the One In One application on your local machine for development purposes.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

### Optional but Recommended
- **Postman** or **Insomnia** - For API testing
- **GitHub Desktop** - For easier Git management
- **Docker** - For containerized development (optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/One_App.git
cd One_App
```

### 2. Set Up Backend (Flask)

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Set Up Environment Variables
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your configuration
```

#### Configure .env File
Open `backend/.env` and configure the following:

```env
# Flask Configuration
SECRET_KEY=your-local-secret-key-here
JWT_SECRET_KEY=your-local-jwt-secret-key-here
DATABASE_URL=sqlite:///one_in_one.db

# Gemini AI Configuration (Required for AI features)
GEMINI_API_KEY=your-gemini-api-key-here

# Google OAuth Configuration (Required for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id-here

# CORS Configuration
CORS_ORIGINS=http://localhost:3000

# Development Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

#### Initialize Database
```bash
python app.py
```
This will create the SQLite database and all necessary tables.

#### Start Backend Server
```bash
python app.py
```
The backend will be available at `http://localhost:5000`

### 3. Set Up Frontend (React)

#### Navigate to Root Directory
```bash
cd ..  # Go back to project root
```

#### Install Dependencies
```bash
npm install
```

#### Create Environment File
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
```

#### Start Frontend Development Server
```bash
npm start
```
The frontend will be available at `http://localhost:3000`

## 🔧 Development Workflow

### Running Both Services

#### Option 1: Separate Terminals
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py

# Terminal 2 - Frontend
cd ..  # Go to project root
npm start
```

#### Option 2: Using npm scripts (Recommended)
Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run backend\" \"npm run frontend\"",
    "backend": "cd backend && python app.py",
    "frontend": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

Then install concurrently:
```bash
npm install --save-dev concurrently
```

Run both services:
```bash
npm run dev
```

## 🗄️ Database Management

### SQLite Database
The app uses SQLite for local development, which creates a `one_in_one.db` file in the backend directory.

#### View Database
You can use any SQLite browser:
- **DB Browser for SQLite** - [Download here](https://sqlitebrowser.org/)
- **SQLiteStudio** - [Download here](https://sqlitestudio.pl/)
- **VS Code Extension** - SQLite Viewer

#### Reset Database
```bash
cd backend
rm one_in_one.db  # Delete the database file
python app.py     # This will recreate it
```

### Database Schema
The app includes these main tables:
- `users` - User accounts and profiles
- `chats` - Chat rooms and conversations
- `messages` - Individual messages
- `notes` - User notes and documents
- `chat_participants` - Chat membership
- `message_reactions` - Message reactions

## 🤖 AI Integration Setup

### Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `backend/.env` file:
   ```env
   GEMINI_API_KEY=your-actual-api-key-here
   ```

### Get Google OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized origins:
   - `http://localhost:3000` (for development)
   - `https://your-domain.com` (for production)
7. Copy the Client ID and add it to both environment files:
   ```env
   # Backend .env
   GOOGLE_CLIENT_ID=your-google-client-id-here
   
   # Frontend .env
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```

### Test AI Integration
Once the API key is set up, you can test AI features:
1. Register a new account in the app
2. Go to the AI tab
3. Try different personas and send messages
4. Check the backend logs for any API errors

### Test Google OAuth
Once the Google OAuth is set up, you can test Google sign-in:
1. Go to the login or register page
2. Click the "Continue with Google" button
3. Complete the Google OAuth flow
4. You should be automatically logged in

## 🔍 Debugging

### Backend Debugging

#### Enable Debug Mode
The backend runs in debug mode by default when `FLASK_DEBUG=True` in your `.env` file.

#### View Logs
```bash
cd backend
python app.py
```
Logs will appear in the terminal.

#### Common Issues
1. **Port 5000 already in use**:
   ```bash
   # Find and kill the process
   lsof -ti:5000 | xargs kill -9  # macOS/Linux
   netstat -ano | findstr :5000   # Windows
   ```

2. **Database locked**:
   ```bash
   # Make sure no other process is using the database
   rm one_in_one.db
   python app.py
   ```

3. **Module not found**:
   ```bash
   # Make sure virtual environment is activated
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate     # Windows
   ```

### Frontend Debugging

#### React Developer Tools
Install the React Developer Tools browser extension for better debugging.

#### Console Logs
Open browser DevTools (F12) to see console logs and errors.

#### Common Issues
1. **CORS errors**:
   - Check that backend is running on port 5000
   - Verify `REACT_APP_API_URL` in frontend `.env`

2. **Module not found**:
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build errors**:
   ```bash
   # Check for syntax errors
   npm run build
   ```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest  # If you add tests
```

### Frontend Testing
```bash
npm test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Create and join chats
- [ ] Send messages and files
- [ ] AI chat functionality
- [ ] Notes creation and editing
- [ ] Theme switching
- [ ] Mobile responsiveness

## 📱 Mobile Development

### Testing on Mobile Devices

#### Option 1: Network Access
1. Find your computer's IP address:
   ```bash
   # macOS/Linux
   ifconfig | grep inet
   
   # Windows
   ipconfig
   ```

2. Update frontend `.env`:
   ```env
   REACT_APP_API_URL=http://YOUR_IP_ADDRESS:5000
   ```

3. Start frontend with host binding:
   ```bash
   REACT_APP_API_URL=http://YOUR_IP_ADDRESS:5000 npm start
   ```

4. Access from mobile: `http://YOUR_IP_ADDRESS:3000`

#### Option 2: ngrok (Recommended)
1. Install ngrok: [Download here](https://ngrok.com/)
2. Expose your backend:
   ```bash
   ngrok http 5000
   ```
3. Update frontend `.env` with the ngrok URL
4. Access from mobile using the ngrok URL

## 🔧 Development Tools

### VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Python**
- **SQLite Viewer**
- **Thunder Client** (API testing)
- **GitLens**

### Useful Commands

#### Backend
```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install new package
pip install package_name
pip freeze > requirements.txt

# Run with specific port
FLASK_RUN_PORT=5001 python app.py
```

#### Frontend
```bash
# Start with specific port
PORT=3001 npm start

# Build for production
npm run build

# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "Module not found" errors
```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
rm -rf node_modules package-lock.json
npm install
```

#### 2. Database connection issues
```bash
cd backend
rm one_in_one.db
python app.py
```

#### 3. CORS errors
- Check that backend is running
- Verify CORS_ORIGINS in backend `.env`
- Check REACT_APP_API_URL in frontend `.env`

#### 4. AI features not working
- Verify GEMINI_API_KEY is set correctly
- Check backend logs for API errors
- Test API key with a simple request

#### 5. Port conflicts
```bash
# Find processes using ports
lsof -i :3000  # Frontend
lsof -i :5000  # Backend

# Kill processes
kill -9 PID_NUMBER
```

#### 6. Socket.IO Authentication Errors
If you see "Missing Authorization Header" errors in the backend logs:
1. Make sure the frontend `.env` file has the correct API URL
2. Check that the JWT token is being stored in localStorage
3. Verify that the backend is running and accessible
4. Clear browser cache and localStorage, then try logging in again

#### 7. Google OAuth Issues
If Google sign-in doesn't work:
1. Verify `REACT_APP_GOOGLE_CLIENT_ID` is set in frontend `.env`
2. Check that `GOOGLE_CLIENT_ID` is set in backend `.env`
3. Ensure the Google OAuth client is configured for the correct origins
4. Check browser console for any JavaScript errors

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Socket.IO Documentation](https://socket.io/docs/)

### API Testing
Use tools like Postman or Thunder Client to test API endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/chats`
- `POST /api/chats/messages`
- `POST /api/ai/chat`

### Database Queries
```sql
-- View all users
SELECT * FROM users;

-- View all chats
SELECT * FROM chats;

-- View messages for a chat
SELECT * FROM messages WHERE chat_id = 1;

-- View user's notes
SELECT * FROM notes WHERE user_id = 1;
```

## 🚀 Next Steps

Once you have the local development environment running:

1. **Explore the codebase** - Familiarize yourself with the structure
2. **Test all features** - Go through each module and test functionality
3. **Make changes** - Start developing new features or improvements
4. **Add tests** - Write unit and integration tests
5. **Deploy** - Follow the deployment guide when ready

## 💡 Tips for Development

1. **Use hot reload** - Both frontend and backend support hot reloading
2. **Check logs** - Always check console and terminal logs for errors
3. **Test on mobile** - Use browser dev tools or actual mobile devices
4. **Version control** - Commit your changes regularly
5. **Document changes** - Update README and comments as you develop

---

Happy coding! 🎉 If you encounter any issues, check the troubleshooting section or create an issue in the repository.
