# MindScribe Blog API 🚀

> A powerful and feature-rich blog API built with NestJS, featuring robust authentication, real-time interactions, and seamless content management.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## ✨ Features

### Core Functionality
- **🔐 Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Secure password hashing with bcrypt
  
- **📝 Post Management**
  - Create, read, update, and delete blog posts
  - Rich text support
  - Image uploads to AWS S3
  - Draft and publish workflow
  
- **👥 Social Features**
  - Like/Unlike posts
  - Comment system
  - Post bookmarking
  - User profiles

### Technical Features
- **📚 API Documentation**
  - Comprehensive Swagger documentation
  - Interactive API testing interface
  
- **🔄 Real-time Updates**
  - Redis-powered caching
  - Optimized performance
  
- **📧 Notifications**
  - Email notifications via Mailgun
  - Custom email templates

## 🛠️ Tech Stack

- **Backend Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Caching**: Redis
- **Containerization**: Docker
- **Cloud Storage**: AWS S3
- **Email Service**: Mailgun
- **Documentation**: Swagger

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v16 or higher)
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tijesus/mindscribe.git
   cd ./mindscribe/backend/blog-app/
   ```

2. **Environment Setup**
   
   Create a `.env` file in the root directory with the following configuration:

   ```env
   # Database Configuration
   DATABASE_URL='postgresql://username:password@host:port/database'

   # Authentication
   SALT='10'
   SECRET='your-jwt-secret'

   # Redis Configuration
   REDIS_URL='your-redis-url'

   # Server Configuration
   PORT=3000

   # AWS Configuration
   AWS_ACCESS_KEY_ID='your-aws-key'
   AWS_SECRET_ACCESS_KEY='your-aws-secret'
   AWS_S3_REGION='your aws bucket region'
   AWS_S3_BUCKET_NAME='your bucket name'

   # Mailgun Configuration
   MAILGUN_API_KEY='your-mailgun-key'
   MAILGUN_URL='your mailgun url'
   TEMPLATE_DIRS='/templates/'
   ```

3. **Launch with Docker**
   ```bash
   docker compose -f dev.docker-compose.yml up
   ```

4. **Access the API**
   - API: `http://localhost:3000`
   - Swagger Documentation: `http://localhost:3000/api`

## 📚 API Documentation

### Authentication Endpoints

```typescript
POST /auth/signup - Register a new user
POST /auth/login    - User login
POST /auth/logout - Logout a user
```

### Posts Endpoints

```typescript
GET    /posts     - Get all posts
POST   /posts     - Create a new post
GET    /posts/:id - Get post by ID
PUT    /posts/:id - Update post
DELETE /posts/:id - Delete post
```

### Social Interaction Endpoints

```typescript
POST   /posts/:id/like     - Like a post
DELETE /posts/:id/like     - Unlike a post
POST   /posts/:id/bookmark - Bookmark a post
DELETE /posts/:id/bookmark - Delete bookmark
POST   /posts/:id/comment  - Comment on a post
```

## 🐳 Docker Support

The application is fully dockerized for consistent development and deployment environments.

### Development Environment

```bash
docker compose -f dev.docker-compose.yml up
```

This will start:
- NestJS application in development mode
- PostgreSQL database
- Redis instance
- Prisma Studio on port 5555

### Production Environment

```bash
docker compose -f docker-compose.yml up
```

## 💾 Database Management

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Run Migrations
npx prisma migrate dev

# Reset Database
npx prisma reset

# Access Prisma Studio
npx prisma studio
```

## 📧 Email Templates

Email templates are stored in the `/templates` directory and support HTML with dynamic variable injection.

Available templates:
- Welcome Email
- Password Reset
- Comment Notification
- Post Like Notification

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## 🧪 Testing

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Test Coverage
npm run test:cov
```

## 📈 Performance Optimizations

- Redis caching for frequently accessed data
- Database query optimization
- Connection pooling
- Response compression
- Static file caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👥 Contact

Author: Praise Josiah
Email: praisechinonso21@gmail.com

## 🙏 Acknowledgments

- NestJS Documentation
- Prisma Documentation
- Docker Documentation
- AWS SDK Documentation

