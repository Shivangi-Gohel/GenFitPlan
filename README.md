# GenFitPlan 🏋️‍♂️🥗

**GenFitPlan** is an AI-powered fitness companion that helps users achieve their fitness goals by generating personalized **workout and diet plans** using **Google Gemini AI**.  
It also features a **dashboard for progress tracking**, **YouTube video integration** for workout tutorials, and an **AI chatbot assistant** to solve user queries.  

---

## 🚀 Features

### 🔹 Personalized Fitness Plan
- Collects **user details** (age, weight, goals, etc.) through an interview process.  
- Generates a **custom workout & diet plan** using **Gemini AI**.  
- Displays the plan in the user’s profile screen.  

### 🔹 Daily Workout Tracking
- Shows **checkboxes for today’s workouts** so users can mark completion.  
- Saves completed workouts in the database for progress tracking.  
- Provides **video tutorials** for exercises via **YouTube API**.  

### 🔹 Dashboard & Progress Analytics
- **Summary cards**:  
  - ✅ Total workouts completed  
  - ✅ Total exercises  
  - ✅ Average exercises per session  
  - ✅ Longest workout streak  
- **Workout history table**: Shows exercise names with dates.  
- **Line chart**: Displays exercises completed per day.  

### 🔹 AI Chatbot Assistant
- Integrated **AI assistant chatbot** to solve user fitness and diet-related queries.  

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ React.js  
- 🎨 Tailwind CSS + ShadCN  
- 🔑 Clerk (Authentication)  

### **Backend**
- 🐍 Python (Django REST Framework)  

### **Database**
- 🍃 MongoDB  

### **AI & Integrations**
- 🤖 Gemini AI (plan generation + chatbot)  
- 🎥 YouTube API (workout videos)  
- 🗣️ Vapi (AI assistant framework)  

---

## 📊 System Workflow

1. **User Interview** → Collects personal info (age, weight, goals).  
2. **Plan Generation** → Gemini AI generates diet & workout plan.  
3. **Workout Execution** → Users mark daily workouts complete & access YouTube tutorials.  
4. **Tracking & Analytics** → Dashboard displays progress (streaks, totals, graph).  
5. **AI Assistance** → Chatbot answers queries and provides guidance.  

---

## 📷 Modules

- 🔑 **Authentication** → User signup/login with Clerk.  
- 👤 **Profile Page** → AI-generated workout & diet plan.  
- ✅ **Workout Tracker** → Daily checkbox completion & tutorials.  
- 📊 **Dashboard** → Stats, history table & progress graph.  
- 💬 **AI Chatbot** → Fitness Q&A assistant.  

---

## 🔮 Future Scope

- 📱 Mobile app version (React Native).  
- ⏰ Smart reminders & push notifications.  
- 🍏 Nutrition analysis with external APIs.  
- 👥 Community challenges & leaderboards.  
- 📈 Wearable device integration (Fitbit, Apple Watch).  

