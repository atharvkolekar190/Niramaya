import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Post, Comment } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { Heart, MessageCircle, Trash2, Plus, Users, Stethoscope, Pill } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export function Community() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Create post form
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: '',
    tags: ''
  });

  // View post dialog
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const filteredPosts = selectedTag === 'All' 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedTag.toLowerCase()));

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedTag]);

  const authHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/tags`);
      if (!res.ok) return;
      const data = await res.json();
      setTags((data.tags || []).map((t: any) => t.tag));
    } catch (e) {
      // non-fatal
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: '1', limit: '20' });
      if (selectedTag !== 'All') params.append('tag', selectedTag);
      const res = await fetch(`${API_BASE_URL}/api/community/posts?${params.toString()}`, { headers: authHeader() });
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      const mapped: Post[] = (data.posts || []).map((p: any) => ({
        id: p.id.toString(),
        title: p.title,
        content: p.content,
        image: p.image_url || undefined,
        tags: Array.isArray(p.tags) ? p.tags : [],
        authorId: p.user_id.toString(),
        author: {
          id: p.user_id.toString(),
          username: p.username,
          email: p.email,
          role: p.role || 'patient',
          verified: p.role === 'doctor' || p.role === 'pharmacist',
          createdAt: p.created_at
        },
        likeCount: p.like_count || 0,
        isLiked: !!p.is_liked,
        commentCount: p.comment_count || 0,
        createdAt: p.created_at
      }));
      setPosts(mapped);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.title || !newPost.content) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          image_url: newPost.image || null,
          tags: newPost.tags ? newPost.tags.split(',').map(t => t.trim()) : []
        })
      });
      if (!res.ok) throw new Error('Failed to create post');
      const data = await res.json();
      const p = data.post;
      const mapped: Post = {
        id: p.id.toString(),
        title: p.title,
        content: p.content,
        image: p.image_url || undefined,
        tags: Array.isArray(p.tags) ? p.tags : [],
        authorId: p.user_id.toString(),
        author: {
          id: p.user_id.toString(),
          username: p.username,
          email: p.email,
          role: p.role || 'patient',
          verified: p.role === 'doctor' || p.role === 'pharmacist',
          createdAt: p.created_at
        },
        likeCount: p.like_count || 0,
        isLiked: false,
        commentCount: p.comment_count || 0,
        createdAt: p.created_at
      };
      setPosts(prev => [mapped, ...prev]);
      setNewPost({ title: '', content: '', image: '', tags: '' });
      setShowCreateDialog(false);
    } catch (e: any) {
      setError(e.message || 'Failed to create post');
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { ...authHeader() }
      });
      if (!res.ok) throw new Error('Failed to like post');
      const data = await res.json();
      const liked = !!data.liked;
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: liked,
              likeCount: liked ? post.likeCount + 1 : post.likeCount - 1
            }
          : post
      ));
    } catch (e) {
      // ignore
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${postId}`, {
        method: 'DELETE',
        headers: { ...authHeader() }
      });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (e: any) {
      setError(e.message || 'Failed to delete post');
    }
  };

  const handleViewPost = async (post: Post) => {
    setSelectedPost(post);
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${post.id}/comments`, { headers: authHeader() });
      if (!res.ok) throw new Error('Failed to load comments');
      const data = await res.json();
      const mapped: Comment[] = (data.comments || []).map((c: any) => ({
        id: c.id.toString(),
        content: c.content,
        authorId: c.user_id.toString(),
        author: {
          id: c.user_id.toString(),
          username: c.username,
          email: c.email,
          role: c.role || 'patient',
          verified: c.role === 'doctor' || c.role === 'pharmacist',
          createdAt: c.created_at
        },
        postId: post.id,
        createdAt: c.created_at
      }));
      setComments(mapped);
    } catch (e: any) {
      setError(e.message || 'Failed to load comments');
    }
  };

  const handleAddComment = async () => {
    if (!user || !selectedPost || !newComment.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ content: newComment.trim() })
      });
      if (!res.ok) throw new Error('Failed to add comment');
      const data = await res.json();
      const c = data.comment;
      const mapped: Comment = {
        id: c.id.toString(),
        content: c.content,
        authorId: c.user_id.toString(),
        author: {
          id: c.user_id.toString(),
          username: c.username,
          email: user.email,
          role: user.role,
          verified: user.verified,
          createdAt: new Date().toISOString()
        },
        postId: selectedPost.id,
        createdAt: new Date().toISOString()
      };
      setComments(prev => [...prev, mapped]);
      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id 
          ? { ...post, commentCount: post.commentCount + 1 }
          : post
      ));
      setNewComment('');
    } catch (e: any) {
      setError(e.message || 'Failed to add comment');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return <Stethoscope className="w-4 h-4" />;
      case 'pharmacist': return <Pill className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'pharmacist': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl">HealthCommunity Forum</h1>
            <Badge className={`${getRoleColor(user?.role || 'patient')} flex items-center gap-1`}>
              {getRoleIcon(user?.role || 'patient')}
              {user?.role}
            </Badge>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tags Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === 'All' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag('All')}
            >
              All Posts
            </Button>
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Create Post Button */}
        <div className="mb-6">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Share your knowledge with the community
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your post content..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL (optional)</Label>
                  <Input
                    id="image"
                    value={newPost.image}
                    onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="diabetes, nutrition, health"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Post</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{post.author.username}</span>
                        {post.author.verified && (
                          <Badge className={getRoleColor(post.author.role)} variant="secondary">
                            {post.author.role}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {post.authorId === user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                
                {post.image && (
                  <div className="mb-4">
                    <img 
                      src={post.image} 
                      alt="Post image" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1 ${post.isLiked ? 'text-red-600' : 'text-gray-600'}`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likeCount}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewPost(post)}
                    className="flex items-center gap-1 text-gray-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.commentCount}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Post Dialog */}
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            {selectedPost && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedPost.title}</DialogTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={selectedPost.author.avatar} />
                      <AvatarFallback>{selectedPost.author.username[0]}</AvatarFallback>
                    </Avatar>
                    {selectedPost.author.username} • {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </div>
                </DialogHeader>
                
                <div className="space-y-4">
                  <p className="text-gray-700">{selectedPost.content}</p>
                  
                  {selectedPost.image && (
                    <img 
                      src={selectedPost.image} 
                      alt="Post image" 
                      className="w-full max-h-64 object-cover rounded-md"
                    />
                  )}

                  <div className="border-t pt-4">
                    <h4 className="mb-3">Comments ({comments.length})</h4>
                    
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-md">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.username[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">{comment.author.username}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={2}
                        className="flex-1"
                      />
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}