import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarContent, AvatarFallback } from './ui/avatar';
import { BloodDropIcon } from './BloodDropIcon';
import { MessageCircle, Send, Phone, Video, MoreVertical } from 'lucide-react';

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      role: 'Blood Bank Coordinator',
      lastMessage: 'We have your blood type available. When can you come in?',
      time: '2 min ago',
      unread: 2,
      avatar: 'SW',
      online: true
    },
    {
      id: 2,
      name: 'John Martinez',
      role: 'Donor',
      lastMessage: 'Thank you for reaching out. I can donate tomorrow.',
      time: '1 hour ago',
      unread: 0,
      avatar: 'JM',
      online: true
    },
    {
      id: 3,
      name: 'Emergency Unit',
      role: 'Hospital',
      lastMessage: 'Urgent: We need O- blood immediately for surgery.',
      time: '3 hours ago',
      unread: 1,
      avatar: 'EU',
      online: false,
      urgent: true
    },
    {
      id: 4,
      name: 'Maria Garcia',
      role: 'Patient',
      lastMessage: 'My surgery is scheduled for Friday. Will you be available?',
      time: '1 day ago',
      unread: 0,
      avatar: 'MG',
      online: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Dr. Sarah Wilson',
      message: 'Hello! I saw your request for A+ blood. We currently have 3 units available at our blood bank.',
      time: '10:30 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'You',
      message: 'That\'s great news! When would be the best time to collect it?',
      time: '10:32 AM',
      isMe: true
    },
    {
      id: 3,
      sender: 'Dr. Sarah Wilson',
      message: 'We\'re open until 6 PM today. The blood is reserved for your patient. Please bring the hospital requisition form.',
      time: '10:35 AM',
      isMe: false
    },
    {
      id: 4,
      sender: 'You',
      message: 'Perfect! I\'ll be there by 2 PM with all the necessary documents.',
      time: '10:37 AM',
      isMe: true
    },
    {
      id: 5,
      sender: 'Dr. Sarah Wilson',
      message: 'We have your blood type available. When can you come in?',
      time: '10:45 AM',
      isMe: false
    }
  ];

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here would be the message sending logic
      setMessage('');
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span>Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                    selectedChat === conversation.id ? 'bg-blue-50 border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => setSelectedChat(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-white text-sm">
                          {conversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-sm">{conversation.name}</p>
                          {conversation.urgent && (
                            <BloodDropIcon className="text-red-500" size={12} />
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          {conversation.unread > 0 && (
                            <Badge className="h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{conversation.role}</p>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-white">
                        {selectedConversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedConversation.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">{selectedConversation.role}</p>
                        {selectedConversation.online && (
                          <Badge variant="outline" className="text-green-600 text-xs">
                            Online
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-96">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.isMe
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.isMe ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <BloodDropIcon className="text-primary" size={16} />
              <span>Emergency Helpline</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Blood Bank Support</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Medical Coordinator</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}