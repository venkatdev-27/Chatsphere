# ChatSphere - Real-time MERN Chat Application

![License](https://img.shields.io/badge/license-ISC-blue.svg) ![Node](https://img.shields.io/badge/Node.js-v18%2B-green) ![React](https://img.shields.io/badge/React-v19-blue) ![Socket.io](https://img.shields.io/badge/Socket.io-v4-black)

## 🚀 Overview

ChatSphere is a robust, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js). It offers a seamless messaging experience with features like one-on-one chats, group conversations, media sharing, and real-time status updates. Designed with a mobile-first approach, it includes a modern dark/light mode UI and smooth animations.

## ✨ Key Features

-   **Real-time Messaging**: Instant message delivery using Socket.io.
-   **Group Chats**: Create, update, and manage group conversations with multiple users.
-   **Media Sharing**: Seamlessly send images and videos in chats.
-   **Secure Authentication**: Robust login/signup with JWT and password hashing.
-   **Responsive Design**: Mobile-first architecture ensures a great experience on any device.
-   **Dark/Light Mode**: User-friendly theme toggle for visual comfort in any environment.
-   **Typing Indicators**: Real-time visual feedback when users are typing.
-   **User Search**: Efficiently find and connect with other users.
-   **Notifications**: Real-time toast notifications for new messages and alerts.
-   **Profile Management**: Update profile pictures and status easily.

## 🛠️ Tech Stack

### Frontend
-   **React 19**: Building modern, interactive user interfaces.
-   **Redux Toolkit**: Efficient and scalable state management.
-   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
-   **Framer Motion**: Adding smooth, complex animations and transitions.
-   **Socket.io Client**: Enabling real-time, bidirectional communication.
-   **Vite**: Next-generation frontend tooling for fast builds.

### Backend
-   **Node.js & Express**: High-performance server-side runtime and framework.
-   **MongoDB & Mongoose**: Flexible NoSQL database with robust object modeling.
-   **Socket.io**: Real-time event-based communication engine.
-   **Redis**: High-performance data structure store for caching (optional).
-   **JWT**: Secure JSON Web Token implementation for stateless authentication.
-   **Multer**: Middleware for handling `multipart/form-data` for file uploads.

## ⚙️ Installation & Setup

### Prerequisites
-   Node.js (v18 or higher)
-   MongoDB (Local instance or MongoDB Atlas)
-   Redis (Optional, for enhanced performance caching)

### 1. Clone the Repository
```bash
git clone https://github.com/venkatdev-27/Chatsphere.git
cd chat-application
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

Start the development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## 🔌 API Endpoints (Overview)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | | |
| POST | `/api/auth/login` | Authenticate user and return token |
| POST | `/api/auth/signup` | Register a new user account |
| **Chat** | | |
| GET | `/api/chat` | Fetch all chats for the logged-in user |
| POST | `/api/chat/group` | Create a new group chat |
| PUT | `/api/chat/rename` | Rename an existing group chat |
| **Message** | | |
| POST | `/api/message` | Send a new message |
| GET | `/api/message/:chatId` | Get all messages for a specific chat |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

Built with ❤️ by [Venkatesh](https://github.com/venkatdev-27)
