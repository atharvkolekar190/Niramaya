import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Community } from './components/Community';
import { ChatRoom } from './components/ChatRoom';

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <ChatRoom />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/community" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}