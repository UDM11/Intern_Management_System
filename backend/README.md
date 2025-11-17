# Intern Management System Backend

A FastAPI-based backend for managing interns and their tasks.

## Features

- **Authentication**: JWT-based authentication with user registration and login
- **Intern Management**: CRUD operations for intern profiles
- **Task Management**: Create, assign, and track tasks for interns
- **Dashboard Analytics**: Statistics and insights about interns and tasks
- **Database**: SQLAlchemy ORM with PostgreSQL/SQLite support

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   Copy `.env` file and update with your database credentials:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/intern_management
   SECRET_KEY=your-secret-key-here
   ```

3. **Run the Application**
   ```bash
   python run.py
   ```

4. **Access API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Interns
- `GET /api/interns/` - List interns (with pagination, search, filters)
- `GET /api/interns/{id}` - Get intern details
- `POST /api/interns/` - Create new intern
- `PUT /api/interns/{id}` - Update intern
- `DELETE /api/interns/{id}` - Delete intern

### Tasks
- `GET /api/tasks/intern/{intern_id}` - Get tasks for specific intern
- `GET /api/tasks/{id}` - Get task details
- `POST /api/tasks/` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/departments` - Get department-wise statistics

## Database Models

### Intern
- Personal information (name, email, phone)
- Department and join date
- Status (active/inactive)
- Related tasks

### Task
- Title and description
- Assigned intern
- Deadline and status
- Creation/update timestamps

### User
- Authentication credentials
- Admin privileges
- Account status

## Development

The backend uses:
- **FastAPI** for the web framework
- **SQLAlchemy** for database ORM
- **Pydantic** for data validation
- **JWT** for authentication
- **Uvicorn** for ASGI server