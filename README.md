# One In One - All-in-One Communication App

A comprehensive mobile-first web application built with React, Flask, and powered by Gemini AI. One In One combines messaging, calls, meetings, AI assistance, note-taking, and email management in a single, beautiful interface.

## 🌟 Features

### 📱 Core Modules
- **OneChat**: Real-time messaging with file sharing, reactions, and AI integration
- **OneCalls**: Audio and video calling capabilities
- **OneMeet**: Meeting rooms with AI transcription and summarization
- **OneAi**: AI assistant with multiple personas (lawyer, writer, teacher, etc.)
- **OneNotes**: Note-taking with AI-powered summarization and drafting
- **OneMail**: Email management with AI-assisted composition

### 🎨 Design & UX
- Mobile-first responsive design
- Ocean Blue theme with light/dark mode support
- Smooth animations powered by Framer Motion
- WhatsApp-like chat interface
- Customizable themes and wallpapers

### 🤖 AI Integration
- Gemini API integration across all modules
- Multiple AI personas for different use cases
- Real-time AI chat assistance
- Automatic transcription and summarization
- AI-powered email drafting and note organization

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-SocketIO** - Real-time WebSocket communication
- **JWT** - Authentication and authorization
- **SQLite** - Database (easily upgradeable to PostgreSQL/MySQL)

### AI & External Services
- **Google Gemini AI** - AI capabilities
- **Google OAuth** - Authentication (planned)

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database**
   ```bash
   python app.py
   ```

6. **Run the server**
   ```bash
   python app.py
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///one_in_one.db
GEMINI_API_KEY=your-gemini-api-key-here
CORS_ORIGINS=http://localhost:3000,https://your-vercel-domain.vercel.app
FLASK_ENV=development
FLASK_DEBUG=True
```

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect your GitHub repository to Vercel**
2. **Set build command**: `npm run build`
3. **Set output directory**: `build`
4. **Add environment variables**:
   - `REACT_APP_API_URL`: Your backend API URL

### Backend (Railway/Heroku/DigitalOcean)

1. **Prepare for deployment**
   ```bash
   # Update requirements.txt
   pip freeze > requirements.txt
   ```

2. **Deploy to Railway**:
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

3. **Deploy to Heroku**:
   ```bash
   # Install Heroku CLI
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

4. **Deploy to DigitalOcean App Platform**:
   - Connect GitHub repository
   - Configure build settings
   - Set environment variables

## 📱 Usage

### Getting Started

1. **Register an account** with a unique username
2. **Explore the modules** using the bottom navigation
3. **Start chatting** by searching for users and creating conversations
4. **Use AI assistance** across all modules for enhanced productivity

### Key Features

- **Real-time messaging** with typing indicators and read receipts
- **File sharing** including images, videos, audio, and documents
- **AI personas** for different types of assistance
- **Meeting rooms** with AI transcription
- **Note-taking** with AI-powered organization
- **Email management** with AI drafting assistance

## 🛠️ Development

### Project Structure

```
One_App/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── chat/         # Chat-related components
│   │   ├── layout/       # Layout components
│   │   └── tabs/         # Tab components for each module
│   ├── contexts/         # React contexts
│   ├── App.js           # Main App component
│   └── index.js         # Entry point
├── backend/
│   ├── app.py           # Flask application
│   ├── requirements.txt # Python dependencies
│   └── env.example      # Environment variables example
└── README.md
```

### Adding New Features

1. **Frontend**: Add components in appropriate directories
2. **Backend**: Add routes in `app.py` and update database models
3. **AI Integration**: Extend the AI routes for new capabilities

### Database Schema

The app uses SQLite with the following main tables:
- `users` - User accounts and profiles
- `chats` - Chat rooms and conversations
- `messages` - Individual messages
- `notes` - User notes and documents
- `chat_participants` - Chat membership
- `message_reactions` - Message reactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** team for the amazing framework
- **TailwindCSS** for the utility-first CSS approach
- **Framer Motion** for smooth animations
- **Google Gemini** for AI capabilities
- **Flask** community for the robust backend framework

## 📞 Support

For support, email support@oneinone.app or create an issue in this repository.

---

**One In One** - Where all your communication needs meet in one beautiful app. 🚀
