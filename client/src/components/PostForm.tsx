import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface PostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: {
    id?: number;
    title: string;
    content: string;
    excerpt: string;
    category: string;
    imageUrl?: string;
  };
  mode?: 'create' | 'edit';
}

export default function PostForm({ onSuccess, onCancel, initialData, mode = 'create' }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || 'family');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Post created successfully!",
        description: "Your post has been published.",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Failed to create post",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await fetch(`/api/posts/${initialData?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Failed to update post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Post updated successfully!",
        description: "Your changes have been saved.",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Failed to update post",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post.",
        variant: "destructive",
      });
      return;
    }

    const excerpt = content.substring(0, 150) + (content.length > 150 ? '...' : '');
    
    const postData = {
      title,
      content,
      excerpt,
      category,
      imageUrl: imageUrl || null,
      authorId: user.id,
      createdAt: new Date().toISOString(),
    };

    if (mode === 'edit') {
      updatePostMutation.mutate(postData);
    } else {
      createPostMutation.mutate(postData);
    }
  };

  const categories = [
    { value: 'family', label: 'Family' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'aviation', label: 'Aviation' },
    { value: 'technology', label: 'Technology' },
    { value: 'nature', label: 'Nature' },
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'farming', label: 'Farming' },
    { value: 'other', label: 'Other' },
  ];

  const isLoading = createPostMutation.isPending || updatePostMutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'edit' ? 'Edit Post' : 'Create New Post'}</CardTitle>
        <CardDescription>
          Share your thoughts and experiences with the family
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL (optional)
            </label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Post' : 'Create Post')}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}