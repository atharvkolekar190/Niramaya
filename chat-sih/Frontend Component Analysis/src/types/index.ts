export interface User {
  id: string;
  username: string;
  email: string;
  role: 'patient' | 'doctor' | 'pharmacist';
  avatar?: string;
  verified?: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  tags: string[];
  authorId: string;
  author: User;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  postId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  author: User;
  roomId: string;
  type: 'text' | 'image';
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  members: User[];
  messages: Message[];
}