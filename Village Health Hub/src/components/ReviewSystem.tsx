import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Flag, Filter, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type UserRole = 'volunteer' | 'patient' | 'doctor' | null;

interface ReviewSystemProps {
  userRole: UserRole;
}

export function ReviewSystem({ userRole }: ReviewSystemProps) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [newReviewRating, setNewReviewRating] = useState(0);

  const reviews = [
    {
      id: 1,
      reviewer: 'Maria Santos',
      reviewerRole: 'patient',
      reviewee: 'Rajesh Kumar\'s Hub',
      revieweeType: 'hub',
      rating: 5,
      title: 'Excellent service and care',
      content: 'Rajesh and his family have created an amazing health hub. The medicines are always well-organized and the space is clean. Dr. Sarah\'s visits here have been very helpful for my family.',
      date: '2024-03-20',
      helpful: 12,
      verified: true,
      tags: ['Clean facility', 'Helpful staff', 'Good doctor visits']
    },
    {
      id: 2,
      reviewer: 'John Kumar',
      reviewerRole: 'patient',
      reviewee: 'Dr. Sarah Johnson',
      revieweeType: 'doctor',
      rating: 5,
      title: 'Very knowledgeable and caring doctor',
      content: 'Dr. Sarah took the time to explain my condition clearly and provided excellent care. Her telemedicine follow-ups have been very convenient.',
      date: '2024-03-18',
      helpful: 8,
      verified: true,
      tags: ['Professional', 'Good communication', 'Telemedicine']
    },
    {
      id: 3,
      reviewer: 'Priya Sharma',
      reviewerRole: 'volunteer',
      reviewee: 'Village Health Hub System',
      revieweeType: 'system',
      rating: 4,
      title: 'Great platform, minor improvements needed',
      content: 'The system has helped me organize my hub better and connect with patients. The medicine inventory feature is very useful. Would love to see more offline capabilities.',
      date: '2024-03-15',
      helpful: 15,
      verified: true,
      tags: ['Easy to use', 'Helpful features', 'Good organization']
    },
    {
      id: 4,
      reviewer: 'Dr. Michael Chen',
      reviewerRole: 'doctor',
      reviewee: 'Community Center Hub',
      revieweeType: 'hub',
      rating: 5,
      title: 'Well-equipped and centrally located',
      content: 'This hub has excellent facilities including a generator backup and good internet connection. Perfect for both in-person consultations and telemedicine sessions.',
      date: '2024-03-12',
      helpful: 6,
      verified: true,
      tags: ['Good facilities', 'Central location', 'Internet connection']
    },
    {
      id: 5,
      reviewer: 'Anonymous Patient',
      reviewerRole: 'patient',
      reviewee: 'Anita Devi\'s Hub',
      revieweeType: 'hub',
      rating: 3,
      title: 'Good service but limited space',
      content: 'Anita is very helpful and the medicines are available, but the space is quite small and can get crowded during doctor visits.',
      date: '2024-03-10',
      helpful: 4,
      verified: false,
      tags: ['Limited space', 'Crowded', 'Helpful host']
    }
  ];

  const averageRatings = {
    overall: 4.6,
    hubs: 4.5,
    doctors: 4.8,
    system: 4.2
  };

  const filteredReviews = reviews.filter(review => {
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'hubs' && review.revieweeType === 'hub') ||
                      (selectedTab === 'doctors' && review.revieweeType === 'doctor') ||
                      (selectedTab === 'system' && review.revieweeType === 'system') ||
                      (selectedTab === 'my-reviews' && review.reviewer === getCurrentUserName());
    
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    
    return matchesTab && matchesRating;
  });

  function getCurrentUserName() {
    if (userRole === 'volunteer') return 'Rajesh Kumar';
    if (userRole === 'patient') return 'Maria Santos';
    if (userRole === 'doctor') return 'Dr. Sarah Johnson';
    return 'Anonymous';
  }

  const renderStarRating = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`text-lg transition-colors ${
              star <= rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reviews & Ratings</h1>
          <p className="text-muted-foreground">
            {userRole === 'volunteer' ? 'Reviews for your hub and community feedback' :
             userRole === 'patient' ? 'Share your experience and read community reviews' :
             userRole === 'doctor' ? 'Patient feedback and hub reviews' :
             'Community reviews and ratings'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Reviews
          </Button>
          <Button>
            <Star className="h-4 w-4 mr-2" />
            Write Review
          </Button>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{averageRatings.overall}</div>
            <div className="flex justify-center mb-2">
              {renderStarRating(averageRatings.overall)}
            </div>
            <p className="text-sm text-muted-foreground">Overall Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{averageRatings.hubs}</div>
            <div className="flex justify-center mb-2">
              {renderStarRating(averageRatings.hubs)}
            </div>
            <p className="text-sm text-muted-foreground">Health Hubs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{averageRatings.doctors}</div>
            <div className="flex justify-center mb-2">
              {renderStarRating(averageRatings.doctors)}
            </div>
            <p className="text-sm text-muted-foreground">Doctors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{averageRatings.system}</div>
            <div className="flex justify-center mb-2">
              {renderStarRating(averageRatings.system)}
            </div>
            <p className="text-sm text-muted-foreground">Platform</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="hubs">Health Hubs</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-3">
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* All Reviews */}
        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Reviews ({filteredReviews.length})</CardTitle>
              <CardDescription>Reviews and feedback from community members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="pb-6 border-b last:border-b-0">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {review.reviewer.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{review.reviewer}</h4>
                        <Badge variant="outline" className="text-xs">
                          {review.reviewerRole}
                        </Badge>
                        {review.verified && (
                          <Badge variant="default" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {renderStarRating(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          for {review.reviewee}
                        </span>
                      </div>
                      
                      <h5 className="font-medium mb-2">{review.title}</h5>
                      <p className="text-sm text-muted-foreground mb-3">{review.content}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {review.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{new Date(review.date).toLocaleDateString()}</span>
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <ThumbsUp className="h-4 w-4" />
                            <span>Helpful ({review.helpful})</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <MessageCircle className="h-4 w-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Write New Review */}
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
              <CardDescription>Share your experience with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reviewType">Review For</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select what to review" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hub">Health Hub</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="system">Platform/System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reviewTarget">Select Specific</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose specific target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rajesh">Rajesh Kumar's Hub</SelectItem>
                        <SelectItem value="priya">Priya Sharma's Hub</SelectItem>
                        <SelectItem value="community">Community Center Hub</SelectItem>
                        <SelectItem value="dr-sarah">Dr. Sarah Johnson</SelectItem>
                        <SelectItem value="dr-michael">Dr. Michael Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2">
                    {renderStarRating(newReviewRating, true, setNewReviewRating)}
                    <span className="text-sm text-muted-foreground ml-2">
                      {newReviewRating > 0 && `${newReviewRating} out of 5 stars`}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewTitle">Review Title</Label>
                  <input
                    id="reviewTitle"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Brief summary of your experience"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewContent">Your Review</Label>
                  <Textarea
                    id="reviewContent"
                    placeholder="Tell others about your experience... What went well? What could be improved?"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewTags">Tags (Optional)</Label>
                  <input
                    id="reviewTags"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Add tags separated by commas (e.g., clean facility, helpful staff)"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={newReviewRating === 0}>
                    Submit Review
                  </Button>
                  <Button type="button" variant="outline">
                    Save Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Guidelines */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Review Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
            <div>
              <h4 className="font-medium mb-2">What makes a good review:</h4>
              <ul className="space-y-1">
                <li>• Be specific about your experience</li>
                <li>• Mention both positives and areas for improvement</li>
                <li>• Include relevant details about timing, service, etc.</li>
                <li>• Be respectful and constructive</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Please avoid:</h4>
              <ul className="space-y-1">
                <li>• Personal attacks or inappropriate language</li>
                <li>• Sharing private medical information</li>
                <li>• Fake or misleading reviews</li>
                <li>• Reviews about competitors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}