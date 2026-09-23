import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Message } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowLeft, Send, Heart, Trash2, Users, Wifi, WifiOff, Stethoscope, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ChatRoom() {
  const { user } = useAuth();
  const { connected, onlineUsers, sendMessage, toggleMessageLike, sendTyping, stopTyping, typingUsers } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const roomId = '1';
  const currentTypingUsers = typingUsers[roomId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // In a real app you'd fetch messages and join room via REST first
    // Here we depend on SocketContext and server events
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      authorId: user.id,
      author: user,
      roomId,
      type: 'text',
      likeCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    sendMessage({ content: newMessage, roomId, type: 'text' });
    setNewMessage('');
    handleStopTyping();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      handleStartTyping();
    }
  };

  const handleStartTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(roomId);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);
  };

  const handleStopTyping = () => {
    setIsTyping(false);
    stopTyping(roomId);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleToggleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            isLiked: !msg.isLiked,
            likeCount: msg.isLiked ? msg.likeCount - 1 : msg.likeCount + 1
          }
        : msg
    ));
    toggleMessageLike(messageId, roomId);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return <Stethoscope className="w-3 h-3" />;
      case 'pharmacist': return <Pill className="w-3 h-3" />;
      default: return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'text-blue-600';
      case 'pharmacist': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/community">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg">General Health Discussion</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {onlineUsers.length + 1} members
                  </Badge>
                  <Badge 
                    variant={connected ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.authorId === user?.id;
            
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.author.avatar} />
                  <AvatarFallback>{message.author.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-sm`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs ${getRoleColor(message.author.role)}`}>
                      {message.author.username}
                    </span>
                    {message.author.verified && getRoleIcon(message.author.role)}
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <div className={`rounded-lg px-3 py-2 ${
                    isOwnMessage 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border shadow-sm'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleLike(message.id)}
                      className={`p-1 h-auto ${message.isLiked ? 'text-red-600' : 'text-gray-500'}`}
                    >
                      <Heart className={`w-3 h-3 ${message.isLiked ? 'fill-current' : ''}`} />
                      {message.likeCount > 0 && (
                        <span className="text-xs ml-1">{message.likeCount}</span>
                      )}
                    </Button>
                    
                    {isOwnMessage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-1 h-auto text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {currentTypingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>
                {currentTypingUsers.map(u => u.username).join(', ')} 
                {currentTypingUsers.length === 1 ? ' is' : ' are'} typing...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t bg-white p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Members Sidebar */}
      <div className="w-64 bg-white border-l">
        <div className="p-4 border-b">
          <h3 className="text-sm">Online Members ({onlineUsers.length + 1})</h3>
        </div>
        
        <div className="p-2 space-y-2 overflow-y-auto">
          {/* Current user */}
          {user && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm truncate">{user.username} (You)</span>
                  {user.verified && getRoleIcon(user.role)}
                </div>
                <Badge variant="outline" className="text-xs">
                  {user.role}
                </Badge>
              </div>
            </div>
          )}

          {/* Other online users */}
          {onlineUsers.map((member) => (
            <div key={member.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
              <Avatar className="w-8 h-8">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm truncate">{member.username}</span>
                  {member.verified && getRoleIcon(member.role)}
                </div>
                <Badge variant="outline" className="text-xs">
                  {member.role}
                </Badge>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          ))}

          {/* Offline section removed in real-time mode */}
        </div>
      </div>
    </div>
  );
}