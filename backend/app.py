from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_socketio import SocketIO, emit, join_room, leave_room
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.auth.transport import requests
from google.oauth2 import id_token

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///one_in_one.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, origins=['http://localhost:3000', 'https://your-vercel-domain.vercel.app'])
socketio = SocketIO(app, cors_allowed_origins=['http://localhost:3000', 'https://your-vercel-domain.vercel.app'])

# Configure Gemini AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    display_name = db.Column(db.String(100), nullable=False)
    profile_photo = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_online = db.Column(db.Boolean, default=False)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'displayName': self.display_name,
            'profilePhoto': self.profile_photo,
            'isOnline': self.is_online,
            'lastSeen': self.last_seen.isoformat() if self.last_seen else None,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    is_group = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_message_id = db.Column(db.Integer, db.ForeignKey('message.id'), nullable=True)

    # Relationships
    participants = db.relationship('ChatParticipant', backref='chat', lazy=True, cascade='all, delete-orphan')
    messages = db.relationship('Message', backref='chat', lazy=True, cascade='all, delete-orphan', foreign_keys='Message.chat_id')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'isGroup': self.is_group,
            'participants': [p.user.to_dict() for p in self.participants],
            'lastMessage': self.messages[-1].to_dict() if self.messages else None,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }

class ChatParticipant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_admin = db.Column(db.Boolean, default=False)

    # Relationships
    user = db.relationship('User', backref='chat_participations')

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(20), default='text')  # text, image, video, audio, file
    message_metadata = db.Column(db.JSON)  # For file info, reactions, etc.
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='sent')  # sent, delivered, read
    is_ai_generated = db.Column(db.Boolean, default=False)

    # Relationships
    sender = db.relationship('User', backref='messages')
    reactions = db.relationship('MessageReaction', backref='message', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'chatId': self.chat_id,
            'sender': self.sender.to_dict(),
            'content': self.content,
            'type': self.message_type,
            'metadata': self.message_metadata or {},
            'timestamp': self.timestamp.isoformat(),
            'status': self.status,
            'isAiGenerated': self.is_ai_generated,
            'reactions': [r.to_dict() for r in self.reactions]
        }

class MessageReaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('message.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    emoji = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', backref='message_reactions')

    def to_dict(self):
        return {
            'id': self.id,
            'emoji': self.emoji,
            'user': self.user.to_dict(),
            'createdAt': self.created_at.isoformat()
        }

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    tags = db.Column(db.JSON)  # List of tags
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_ai_generated = db.Column(db.Boolean, default=False)

    # Relationships
    user = db.relationship('User', backref='notes')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'tags': self.tags or [],
            'isAiGenerated': self.is_ai_generated,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['username', 'email', 'password', 'displayName']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if username already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            display_name=data['displayName']
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'User created successfully',
            'token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Update last seen
        user.last_seen = datetime.utcnow()
        user.is_online = True
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 400
        
        # Verify the Google ID token
        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), os.getenv('GOOGLE_CLIENT_ID'))
            
            # Extract user information
            google_id = idinfo['sub']
            email = idinfo['email']
            name = idinfo.get('name', '')
            picture = idinfo.get('picture', '')
            
        except ValueError as e:
            return jsonify({'error': 'Invalid token'}), 400
        
        # Check if user already exists
        user = User.query.filter_by(email=email).first()
        
        if user:
            # User exists, update last seen and online status
            user.last_seen = datetime.utcnow()
            user.is_online = True
            if picture and not user.profile_photo:
                user.profile_photo = picture
            db.session.commit()
        else:
            # Create new user
            # Generate username from email
            username = email.split('@')[0]
            # Ensure username is unique
            original_username = username
            counter = 1
            while User.query.filter_by(username=username).first():
                username = f"{original_username}{counter}"
                counter += 1
            
            user = User(
                username=username,
                email=email,
                display_name=name or username,
                profile_photo=picture,
                password_hash=None  # No password for Google OAuth users
            )
            db.session.add(user)
            db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Google authentication successful',
            'token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update fields if provided
        if 'displayName' in data:
            user.display_name = data['displayName']
        if 'email' in data:
            user.email = data['email']
        if 'username' in data:
            user.username = data['username']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User Routes
@app.route('/api/users/search', methods=['GET'])
@jwt_required()
def search_users():
    try:
        query = request.args.get('q', '')
        current_user_id = get_jwt_identity()
        
        if len(query) < 2:
            return jsonify({'users': []}), 200
        
        users = User.query.filter(
            (User.username.contains(query)) | 
            (User.display_name.contains(query))
        ).filter(User.id != current_user_id).limit(10).all()
        
        return jsonify({
            'users': [user.to_dict() for user in users]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Chat Routes
@app.route('/api/chats', methods=['GET'])
@jwt_required()
def get_chats():
    try:
        user_id = get_jwt_identity()
        
        # Get chats where user is a participant
        chats = db.session.query(Chat).join(ChatParticipant).filter(
            ChatParticipant.user_id == user_id
        ).order_by(Chat.updated_at.desc()).all()
        
        return jsonify({
            'chats': [chat.to_dict() for chat in chats]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chats', methods=['POST'])
@jwt_required()
def create_chat():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Get participant usernames
        participant_usernames = data.get('participants', [])
        
        # Find users by username
        participants = User.query.filter(User.username.in_(participant_usernames)).all()
        
        if not participants:
            return jsonify({'error': 'No valid participants found'}), 400
        
        # Create chat
        chat = Chat(is_group=len(participants) > 1)
        db.session.add(chat)
        db.session.flush()  # Get chat ID
        
        # Add current user as participant
        current_user = User.query.get(user_id)
        chat_participant = ChatParticipant(
            chat_id=chat.id,
            user_id=user_id,
            is_admin=True
        )
        db.session.add(chat_participant)
        
        # Add other participants
        for participant in participants:
            if participant.id != user_id:
                chat_participant = ChatParticipant(
                    chat_id=chat.id,
                    user_id=participant.id
                )
                db.session.add(chat_participant)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Chat created successfully',
            'chat': chat.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chats/<int:chat_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(chat_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if user is participant
        participant = ChatParticipant.query.filter_by(
            chat_id=chat_id, 
            user_id=user_id
        ).first()
        
        if not participant:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get messages
        messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.timestamp.asc()).all()
        
        return jsonify({
            'messages': [message.to_dict() for message in messages]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chats/messages', methods=['POST'])
@jwt_required()
def send_message():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if user is participant
        participant = ChatParticipant.query.filter_by(
            chat_id=data['chatId'], 
            user_id=user_id
        ).first()
        
        if not participant:
            return jsonify({'error': 'Access denied'}), 403
        
        # Create message
        message = Message(
            chat_id=data['chatId'],
            sender_id=user_id,
            content=data['content'],
            message_type=data.get('type', 'text'),
            message_metadata=data.get('metadata', {})
        )
        
        db.session.add(message)
        
        # Update chat's last message
        chat = Chat.query.get(data['chatId'])
        chat.last_message_id = message.id
        chat.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': message.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Notes Routes
@app.route('/api/notes', methods=['GET'])
@jwt_required()
def get_notes():
    try:
        user_id = get_jwt_identity()
        notes = Note.query.filter_by(user_id=user_id).order_by(Note.updated_at.desc()).all()
        
        return jsonify({
            'notes': [note.to_dict() for note in notes]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes', methods=['POST'])
@jwt_required()
def create_note():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        note = Note(
            user_id=user_id,
            title=data.get('title', 'Untitled Note'),
            content=data.get('content', ''),
            tags=data.get('tags', [])
        )
        
        db.session.add(note)
        db.session.commit()
        
        return jsonify({
            'message': 'Note created successfully',
            'note': note.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    try:
        user_id = get_jwt_identity()
        note = Note.query.filter_by(id=note_id, user_id=user_id).first()
        
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            note.title = data['title']
        if 'content' in data:
            note.content = data['content']
        if 'tags' in data:
            note.tags = data['tags']
        
        note.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Note updated successfully',
            'note': note.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    try:
        user_id = get_jwt_identity()
        note = Note.query.filter_by(id=note_id, user_id=user_id).first()
        
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        db.session.delete(note)
        db.session.commit()
        
        return jsonify({'message': 'Note deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# AI Routes
@app.route('/api/ai/chat', methods=['POST'])
@jwt_required()
def ai_chat():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        # Get user for context
        user = User.query.get(user_id)
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-pro')
        
        # Create prompt based on persona
        persona = data.get('persona', 'main')
        message = data.get('message', '')
        
        if persona == 'main':
            prompt = f"You are a helpful AI assistant. User: {user.display_name} is asking: {message}"
        elif persona == 'lawyer':
            prompt = f"You are a legal assistant. Provide legal advice and information. User: {user.display_name} is asking: {message}"
        elif persona == 'writer':
            prompt = f"You are a writing assistant. Help with content creation and editing. User: {user.display_name} is asking: {message}"
        elif persona == 'teacher':
            prompt = f"You are an educational tutor. Help with learning and teaching. User: {user.display_name} is asking: {message}"
        elif persona == 'doctor':
            prompt = f"You are a health advisor. Provide general health information (not medical advice). User: {user.display_name} is asking: {message}"
        elif persona == 'developer':
            prompt = f"You are a code assistant. Help with programming and technical questions. User: {user.display_name} is asking: {message}"
        else:
            prompt = f"You are a helpful AI assistant. User: {user.display_name} is asking: {message}"
        
        # Generate response
        response = model.generate_content(prompt)
        
        return jsonify({
            'response': response.text,
            'persona': persona
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Socket.IO Events
@socketio.on('connect')
def handle_connect(auth=None):
    try:
        # Get token from auth or request headers
        token = None
        if auth and 'token' in auth:
            token = auth['token']
        elif request.headers.get('Authorization'):
            token = request.headers.get('Authorization').replace('Bearer ', '')
        
        if not token:
            return False
        
        # Verify JWT token
        from flask_jwt_extended import decode_token
        decoded_token = decode_token(token)
        user_id = decoded_token['sub']
        
        user = User.query.get(user_id)
        if user:
            user.is_online = True
            user.last_seen = datetime.utcnow()
            db.session.commit()
            emit('userOnline', {'userId': user_id})
            return True
        return False
    except Exception as e:
        print(f"Socket connect error: {e}")
        return False

@socketio.on('disconnect')
def handle_disconnect():
    try:
        # Get token from request headers
        token = request.headers.get('Authorization')
        if token:
            token = token.replace('Bearer ', '')
            from flask_jwt_extended import decode_token
            decoded_token = decode_token(token)
            user_id = decoded_token['sub']
            
            user = User.query.get(user_id)
            if user:
                user.is_online = False
                user.last_seen = datetime.utcnow()
                db.session.commit()
                emit('userOffline', {'userId': user_id})
    except Exception as e:
        print(f"Socket disconnect error: {e}")

@socketio.on('join_chat')
def handle_join_chat(data):
    try:
        # Get user ID from token
        token = request.headers.get('Authorization')
        if not token:
            return False
        token = token.replace('Bearer ', '')
        from flask_jwt_extended import decode_token
        decoded_token = decode_token(token)
        user_id = decoded_token['sub']
        
        chat_id = data['chatId']
        
        # Check if user is participant
        participant = ChatParticipant.query.filter_by(
            chat_id=chat_id, 
            user_id=user_id
        ).first()
        
        if participant:
            join_room(f'chat_{chat_id}')
            emit('joined_chat', {'chatId': chat_id})
            return True
        return False
    except Exception as e:
        print(f"Join chat error: {e}")
        return False

@socketio.on('leave_chat')
def handle_leave_chat(data):
    try:
        chat_id = data['chatId']
        leave_room(f'chat_{chat_id}')
        emit('left_chat', {'chatId': chat_id})
    except Exception as e:
        print(f"Leave chat error: {e}")

@socketio.on('send_message')
def handle_send_message(data):
    try:
        # Get user ID from token
        token = request.headers.get('Authorization')
        if not token:
            return False
        token = token.replace('Bearer ', '')
        from flask_jwt_extended import decode_token
        decoded_token = decode_token(token)
        user_id = decoded_token['sub']
        
        chat_id = data['chatId']
        
        # Check if user is participant
        participant = ChatParticipant.query.filter_by(
            chat_id=chat_id, 
            user_id=user_id
        ).first()
        
        if participant:
            # Broadcast message to all participants in the chat
            emit('message', data, room=f'chat_{chat_id}')
            return True
        return False
    except Exception as e:
        print(f"Send message error: {e}")
        return False

@socketio.on('typing')
def handle_typing(data):
    try:
        # Get user ID from token
        token = request.headers.get('Authorization')
        if not token:
            return False
        token = token.replace('Bearer ', '')
        from flask_jwt_extended import decode_token
        decoded_token = decode_token(token)
        user_id = decoded_token['sub']
        
        chat_id = data['chatId']
        is_typing = data['isTyping']
        
        # Broadcast typing status to other participants
        emit('typing', {
            'chatId': chat_id,
            'userId': user_id,
            'isTyping': is_typing
        }, room=f'chat_{chat_id}', include_self=False)
        return True
    except Exception as e:
        print(f"Typing error: {e}")
        return False

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Initialize Database
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    # Run the app
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
