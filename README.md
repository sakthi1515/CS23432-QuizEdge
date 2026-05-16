# 🎓 Quiz Generator

A full-stack web application for creating and taking quizzes, built with Flask, MongoDB, and vanilla HTML/CSS/JS.

## 🛠 Tech Stack

- **Backend:** Python 3.9+ / Flask
- **Database:** MongoDB (via PyMongo)
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Security:** bcrypt password hashing

## 📁 Project Structure

```
quiz_generator/
├── app.py                  # Flask application & all routes
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
├── README.md
├── templates/
│   ├── base.html           # Base layout with navbar
│   ├── index.html          # Welcome / role selection
│   ├── login.html          # Login form
│   ├── register.html       # Registration form
│   ├── teacher_dashboard.html
│   ├── student_dashboard.html
│   ├── create_quiz.html    # Quiz builder
│   ├── quiz.html           # Quiz-taking interface
│   ├── result.html         # Score & review page
│   └── quiz_results.html   # Teacher results view
└── static/
    ├── css/
    │   └── style.css       # All styling
    └── js/
        ├── main.js         # Global utilities
        ├── create_quiz.js  # Quiz builder logic
        └── quiz.js         # Timer & quiz taking logic
```

## ⚙️ Prerequisites

1. **Python 3.9+** installed
2. **MongoDB** running locally (default: `mongodb://localhost:27017/`)
   - [Install MongoDB Community Edition](https://www.mongodb.com/try/download/community)
   - Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud tier)

## 🚀 Setup & Run

### 1. Clone / extract the project
```bash
cd quiz_generator
```

### 2. Create a virtual environment
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment
Edit `.env`:
```
SECRET_KEY=your-very-secret-key-here
MONGO_URI=mongodb://localhost:27017/
```

For MongoDB Atlas, use:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### 5. Start MongoDB (if running locally)
```bash
# macOS (with Homebrew):
brew services start mongodb-community

# Ubuntu/Linux:
sudo systemctl start mongod

# Windows: Start from Services or run:
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe"
```

### 6. Run the application
```bash
python app.py
```

Visit: **http://localhost:5000**

## 🗄️ MongoDB Collections

### `users`
| Field | Type | Description |
|-------|------|-------------|
| username | String (unique) | Login username |
| password | Binary | bcrypt hashed |
| role | String | "student" or "teacher" |
| created_at | DateTime | Registration time |

### `quizzes`
| Field | Type | Description |
|-------|------|-------------|
| title | String | Quiz name |
| teacher | String | Creator's username |
| timer | Int | Duration in minutes |
| questions | Array | List of question objects |
| created_at | DateTime | Creation time |

Each question object:
```json
{
  "id": "unique_id",
  "question": "What is 2+2?",
  "options": ["2", "3", "4", "5"],
  "correct_answer": "4"
}
```

### `attempts`
| Field | Type | Description |
|-------|------|-------------|
| student_username | String | Who took the quiz |
| quiz_id | String | Reference to quiz |
| score | Int | Number correct |
| total | Int | Total questions |
| answers | Array | Detailed per-question results |
| submitted_at | DateTime | Submission time |

## ✨ Features

- **Role-based access** — separate Teacher and Student portals
- **Password hashing** — bcrypt with salt
- **Random question order** — shuffled each attempt
- **Random option order** — answer choices shuffled too
- **Countdown timer** — auto-submits when time expires
- **Progress bar** — tracks answered questions
- **One attempt only** — prevents retaking quizzes
- **Leaderboard** — top 10 scores per quiz
- **Teacher analytics** — who attempted, who hasn't
- **Responsive design** — works on mobile & desktop

## 🔒 Security Notes

- Change `SECRET_KEY` in `.env` before production deployment
- Passwords are hashed with bcrypt (never stored in plaintext)
- Session-based authentication
- Input validation on all forms

## 📝 Usage Guide

### As a Teacher:
1. Register with role = Teacher
2. Log in → Teacher Dashboard
3. Click **Create Quiz** → add title, timer, questions & answers
4. Mark the correct answer with the radio button
5. Click **Save Quiz**
6. View student results from the dashboard

### As a Student:
1. Register with role = Student  
2. Log in → Student Dashboard
3. Click **Start Quiz** on any available quiz
4. Answer questions (timer is live in the sidebar)
5. Click **Submit Quiz** or wait for auto-submit
6. View your score, review answers, and see the leaderboard
