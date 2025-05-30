
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const FeedbackForm = () => {
  const [feedbackData, setFeedbackData] = useState({
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedbackData);
    alert('Feedback submitted successfully!');
    setFeedbackData({ subject: '', message: '' });
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">Submit Feedback</h1>
        <p className="text-gray-600">Share your thoughts, suggestions, or concerns with us.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feedback Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter feedback subject"
                value={feedbackData.subject}
                onChange={(e) => setFeedbackData({...feedbackData, subject: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your detailed feedback..."
                rows={6}
                value={feedbackData.message}
                onChange={(e) => setFeedbackData({...feedbackData, message: e.target.value})}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90 text-white"
            >
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackForm;
