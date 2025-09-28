# Deployment Guide for One In One

This guide covers deploying the One In One application to production environments.

## 🚀 Frontend Deployment (Vercel)

### Prerequisites
- GitHub repository with the code
- Vercel account

### Steps

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Configure DNS records as instructed

## 🖥️ Backend Deployment Options

### Option 1: Railway (Recommended)

#### Prerequisites
- GitHub repository
- Railway account

#### Steps

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Environment**
   - Add environment variables:
     ```
     SECRET_KEY=your-production-secret-key
     JWT_SECRET_KEY=your-production-jwt-key
     DATABASE_URL=postgresql://username:password@host:port/database
     GEMINI_API_KEY=your-gemini-api-key
     CORS_ORIGINS=https://your-frontend-domain.vercel.app
     FLASK_ENV=production
     FLASK_DEBUG=False
     ```

3. **Deploy**
   - Railway will automatically detect Python and install dependencies
   - Your app will be available at the provided URL

### Option 2: Heroku

#### Prerequisites
- Heroku CLI installed
- Git repository

#### Steps

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL Database**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set JWT_SECRET_KEY=your-jwt-key
   heroku config:set GEMINI_API_KEY=your-gemini-key
   heroku config:set CORS_ORIGINS=https://your-frontend-domain.vercel.app
   heroku config:set FLASK_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

#### Prerequisites
- DigitalOcean account
- GitHub repository

#### Steps

1. **Create New App**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure App Spec**
   ```yaml
   name: one-in-one-backend
   services:
   - name: api
     source_dir: /backend
     github:
       repo: your-username/your-repo
       branch: main
     run_command: python app.py
     environment_slug: python
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: SECRET_KEY
       value: your-secret-key
     - key: JWT_SECRET_KEY
       value: your-jwt-key
     - key: GEMINI_API_KEY
       value: your-gemini-key
     - key: CORS_ORIGINS
       value: https://your-frontend-domain.vercel.app
     - key: FLASK_ENV
       value: production
   ```

3. **Deploy**
   - Click "Create Resources"
   - DigitalOcean will build and deploy your app

### Option 4: AWS EC2

#### Prerequisites
- AWS account
- EC2 instance running Ubuntu

#### Steps

1. **Connect to EC2 Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nginx
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo/backend
   ```

4. **Set Up Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. **Configure Environment**
   ```bash
   cp env.example .env
   # Edit .env with production values
   ```

6. **Set Up Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/one-in-one
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

7. **Enable Site and Start Services**
   ```bash
   sudo ln -s /etc/nginx/sites-available/one-in-one /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Run Application**
   ```bash
   cd /path/to/your/app/backend
   source venv/bin/activate
   python app.py
   ```

## 🔧 Production Configuration

### Database Setup

#### For PostgreSQL (Production)
1. **Create Database**
   ```sql
   CREATE DATABASE one_in_one;
   CREATE USER one_in_one_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE one_in_one TO one_in_one_user;
   ```

2. **Update Database URL**
   ```
   DATABASE_URL=postgresql://one_in_one_user:your_password@localhost:5432/one_in_one
   ```

### SSL/HTTPS Setup

#### Using Let's Encrypt (Nginx)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Using Cloudflare
1. Add your domain to Cloudflare
2. Update DNS records to point to your server
3. Enable SSL/TLS encryption mode

### Environment Variables Checklist

#### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com
```

#### Backend (.env)
```
SECRET_KEY=your-very-secure-secret-key
JWT_SECRET_KEY=your-very-secure-jwt-key
DATABASE_URL=postgresql://user:pass@host:port/db
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGINS=https://your-frontend-domain.vercel.app
FLASK_ENV=production
FLASK_DEBUG=False
```

## 📊 Monitoring & Maintenance

### Health Checks
- Set up monitoring for your backend API
- Monitor database performance
- Set up alerts for downtime

### Logs
- Monitor application logs
- Set up log aggregation (e.g., with Papertrail, LogDNA)
- Monitor error rates and performance

### Updates
- Set up CI/CD pipeline for automatic deployments
- Test updates in staging environment first
- Keep dependencies updated

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

3. **API Security**
   - Implement rate limiting
   - Use HTTPS everywhere
   - Validate all inputs

4. **CORS Configuration**
   - Only allow necessary origins
   - Don't use wildcard (*) in production

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS_ORIGINS environment variable
   - Ensure frontend URL is included

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server status
   - Verify credentials

3. **Build Failures**
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

4. **API Not Responding**
   - Check if backend is running
   - Verify port configuration
   - Check firewall settings

### Getting Help

- Check application logs
- Monitor server resources (CPU, memory, disk)
- Test API endpoints directly
- Verify environment variables

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Implement database connection pooling
- Consider microservices architecture

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching (Redis)

### CDN
- Use CDN for static assets
- Implement image optimization
- Cache API responses where appropriate

---

This deployment guide should help you get One In One running in production. For additional support, refer to the platform-specific documentation or create an issue in the repository.
