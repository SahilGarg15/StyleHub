import { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  productId: string;
  onReviewSubmit?: (review: Omit<Review, 'id'>) => void;
}

export const ProductReviews = ({ reviews, averageRating, totalReviews, productId, onReviewSubmit }: ProductReviewsProps) => {
  const { user, isAuthenticated } = useAuthContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    comment: '',
  });

  // Ensure reviews is always an array
  const reviewsList = Array.isArray(reviews) ? reviews : [];
  const avgRating = averageRating ?? 0;
  const reviewCount = totalReviews ?? reviewsList.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviewsList.filter(r => Math.floor(r.rating) === rating).length,
    percentage: reviewCount > 0 
      ? (reviewsList.filter(r => Math.floor(r.rating) === rating).length / reviewCount) * 100 
      : 0,
  }));

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    const newReview: Omit<Review, 'id'> = {
      productId,
      userId: user?.id || 'guest',
      userName: user?.name || reviewForm.userName || 'Anonymous',
      rating,
      comment: reviewForm.comment,
      date: new Date().toISOString(),
      helpful: 0,
      verified: true, // In a real app, this would be based on purchase history
    };

    if (onReviewSubmit) {
      onReviewSubmit(newReview);
    }

    toast({
      title: 'Review Submitted!',
      description: 'Thank you for your feedback.',
    });

    setIsDialogOpen(false);
    setReviewForm({ userName: '', comment: '' });
    setRating(5);
  };

  return (
    <div className="space-y-8">
      {/* Write Review Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Customer Reviews</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Write a Review</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Write Your Review</DialogTitle>
              <DialogDescription>
                Share your thoughts about this product with other customers.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label>Your Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={cn(
                          'h-8 w-8 transition-colors',
                          star <= (hoveredRating || rating)
                            ? 'fill-accent text-accent'
                            : 'text-muted-foreground'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              {!isAuthenticated && (
                <div>
                  <Label htmlFor="review-name">Your Name</Label>
                  <Input
                    id="review-name"
                    value={reviewForm.userName}
                    onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                    placeholder="Enter your name (or leave blank for Anonymous)"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="review-comment">Your Review</Label>
                <Textarea
                  id="review-comment"
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Tell us more about your experience with this product..."
                  rows={5}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Submit Review</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Rating Summary */}
        <div className="md:w-1/3 space-y-4">
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-primary">{avgRating.toFixed(1)}</div>
            <div className="flex items-center justify-center md:justify-start gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= avgRating 
                      ? 'fill-accent text-accent' 
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">{reviewCount} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-8">{rating}★</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:w-2/3 space-y-6">
          {reviewsList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviewsList.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating 
                              ? 'fill-accent text-accent' 
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {review.date ? new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                  </span>
                </div>

                <p className="text-muted-foreground mt-3">{review.comment}</p>

                <div className="flex items-center gap-4 mt-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful || 0})
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
