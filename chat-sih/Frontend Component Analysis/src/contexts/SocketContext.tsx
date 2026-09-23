import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Message } from '../types';
import { useAuth } from './AuthContext';
import io, { Socket } from 'socket.io-client';

interface SocketContextType {
  connected: boolean;
  onlineUsers: User[];
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (data: { content: string; roomId: string; type: 'text' | 'image' }) => void;
  sendTyping: (roomId: string) => void;
  stopTyping: (roomId: string) => void;
  toggleMessageLike: (messageId: string, roomId: string) => void;
  typingUsers: { [roomId: string]: User[] };
  messages: Message[];
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [roomId: string]: User[] }>({});
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (user && !loading) {
      const token = localStorage.getItem('token');
      if (token) {
        const newSocket = io(API_BASE_URL, {
          auth: {
            token: token
          }
        });

        newSocket.on('connect', () => {
          console.log('Connected to server');
          setConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from server');
          setConnected(false);
        });

        newSocket.on('online_users', (users: any[]) => {
          setOnlineUsers(users.map(u => ({
            id: u.userId.toString(),
            username: u.username,
            email: u.email || '',
            role: u.role || 'patient',
            verified: u.role === 'doctor' || u.role === 'pharmacist',
            createdAt: new Date().toISOString()
          })));
        });

        newSocket.on('user_online', (userData: any) => {
          setOnlineUsers(prev => {
            const exists = prev.find(u => u.id === userData.userId.toString());
            if (!exists) {
              return [...prev, {
                id: userData.userId.toString(),
                username: userData.username,
                email: userData.email || '',
                role: userData.role || 'patient',
                verified: userData.role === 'doctor' || userData.role === 'pharmacist',
                createdAt: new Date().toISOString()
              }];
            }
            return prev;
          });
        });

        newSocket.on('user_offline', (userData: any) => {
          setOnlineUsers(prev => prev.filter(u => u.id !== userData.userId.toString()));
        });

        newSocket.on('new_message', (message: any) => {
          setMessages(prev => [...prev, {
            id: message.id.toString(),
            content: message.content,
            authorId: message.userId.toString(),
            author: {
              id: message.userId.toString(),
              username: message.username,
              email: '',
              role: message.role || 'patient',
              verified: message.role === 'doctor' || message.role === 'pharmacist',
              createdAt: new Date().toISOString()
            },
            roomId: message.roomId.toString(),
            type: message.type || 'text',
            likeCount: message.like_count || 0,
            isLiked: message.is_liked || false,
            createdAt: message.timestamp || new Date().toISOString()
          }]);
        });

        newSocket.on('user_typing', (data: { userId: number; username: string; roomId: string }) => {
          setTypingUsers(prev => ({
            ...prev,
            [data.roomId]: [...(prev[data.roomId] || []), {
              id: data.userId.toString(),
              username: data.username,
              email: '',
              role: 'patient',
              verified: false,
              createdAt: new Date().toISOString()
            }].filter((u, i, arr) => 
              arr.findIndex(user => user.id === u.id) === i
            )
          }));
        });

        newSocket.on('user_stopped_typing', (data: { userId: number; roomId: string }) => {
          setTypingUsers(prev => ({
            ...prev,
            [data.roomId]: (prev[data.roomId] || []).filter(u => u.id !== data.userId.toString())
          }));
        });

        newSocket.on('message_like_toggled', (data: any) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === data.messageId.toString()
                ? { 
                    ...msg, 
                    isLiked: data.liked,
                    likeCount: data.liked ? msg.likeCount + 1 : msg.likeCount - 1
                  }
                : msg
            )
          );
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      }
    } else {
      setConnected(false);
      setOnlineUsers([]);
      setMessages([]);
    }
  }, [user, loading]);

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('join_room', roomId);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leave_room', roomId);
    }
  };

  const sendMessage = (data: { content: string; roomId: string; type: 'text' | 'image' }) => {
    if (socket) {
      socket.emit('send_message', data);
    }
  };

  const sendTyping = (roomId: string) => {
    if (socket) {
      socket.emit('typing_start', { roomId });
    }
  };

  const stopTyping = (roomId: string) => {
    if (socket) {
      socket.emit('typing_stop', { roomId });
    }
  };

  const toggleMessageLike = (messageId: string, roomId: string) => {
    if (socket) {
      socket.emit('toggle_message_like', { messageId, roomId });
    }
  };

  return (
    <SocketContext.Provider value={{
      connected,
      onlineUsers,
      joinRoom,
      leaveRoom,
      sendMessage,
      sendTyping,
      stopTyping,
      toggleMessageLike,
      typingUsers,
      messages,
      socket
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}