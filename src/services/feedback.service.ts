import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc,
  doc,
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authService } from './auth.service';

export interface Feedback {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: 'general' | 'event' | 'suggestion' | 'complaint' | 'technical';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  responseMessage?: string;
  respondedBy?: string;
  respondedAt?: Date;
  attachments?: string[];
}

class FeedbackService {
  private feedbackCollection = collection(db, 'feedback');

  // Submit feedback
  async submitFeedback(feedbackData: {
    subject: string;
    message: string;
    category: Feedback['category'];
    priority?: Feedback['priority'];
    attachments?: string[];
  }): Promise<string> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (currentUser.role === 'guest') {
        throw new Error('Guests cannot submit feedback');
      }

      const feedback: Omit<Feedback, 'id'> = {
        userId: currentUser.uid,
        userName: currentUser.fullName,
        userEmail: currentUser.email,
        subject: feedbackData.subject,
        message: feedbackData.message,
        category: feedbackData.category,
        priority: feedbackData.priority || 'medium',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: feedbackData.attachments || []
      };

      const docRef = await addDoc(this.feedbackCollection, feedback);
      return docRef.id;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error('Failed to submit feedback');
    }
  }

  // Respond to feedback (Executive only)
  async respondToFeedback(
    feedbackId: string, 
    responseMessage: string, 
    status: 'reviewed' | 'resolved' | 'closed'
  ): Promise<void> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.isExecutive()) {
        throw new Error('Not authorized to respond to feedback');
      }

      const updates = {
        status,
        responseMessage,
        respondedBy: currentUser.uid,
        respondedAt: new Date(),
        updatedAt: new Date()
      };

      await updateDoc(doc(this.feedbackCollection, feedbackId), updates);
    } catch (error) {
      console.error('Error responding to feedback:', error);
      throw new Error('Failed to respond to feedback');
    }
  }

  // Get user's feedback
  async getUserFeedback(userId: string): Promise<Feedback[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.feedbackCollection,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        )
      );

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Feedback));
    } catch (error) {
      console.error('Error getting user feedback:', error);
      throw new Error('Failed to get user feedback');
    }
  }

  // Get all feedback (Executive only)
  async getAllFeedback(): Promise<Feedback[]> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.isExecutive()) {
        throw new Error('Not authorized to view all feedback');
      }

      const querySnapshot = await getDocs(
        query(this.feedbackCollection, orderBy('createdAt', 'desc'))
      );

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Feedback));
    } catch (error) {
      console.error('Error getting all feedback:', error);
      throw new Error('Failed to get feedback');
    }
  }

  // Get feedback by status (Executive only)
  async getFeedbackByStatus(status: Feedback['status']): Promise<Feedback[]> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.isExecutive()) {
        throw new Error('Not authorized to view feedback');
      }

      const querySnapshot = await getDocs(
        query(
          this.feedbackCollection,
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        )
      );

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Feedback));
    } catch (error) {
      console.error('Error getting feedback by status:', error);
      throw new Error('Failed to get feedback');
    }
  }

  // Get feedback by category (Executive only)
  async getFeedbackByCategory(category: Feedback['category']): Promise<Feedback[]> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.isExecutive()) {
        throw new Error('Not authorized to view feedback');
      }

      const querySnapshot = await getDocs(
        query(
          this.feedbackCollection,
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        )
      );

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Feedback));
    } catch (error) {
      console.error('Error getting feedback by category:', error);
      throw new Error('Failed to get feedback');
    }
  }

  // Subscribe to user's feedback
  subscribeToUserFeedback(userId: string, callback: (feedback: Feedback[]) => void): () => void {
    const q = query(
      this.feedbackCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const feedback = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Feedback));
      
      callback(feedback);
    });
  }

  // Subscribe to all feedback (Executive only)
  subscribeToAllFeedback(callback: (feedback: Feedback[]) => void): () => void {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !authService.isExecutive()) {
      throw new Error('Not authorized to subscribe to all feedback');
    }

    const q = query(this.feedbackCollection, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const feedback = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Feedback));
      
      callback(feedback);
    });
  }

  // Get feedback statistics (Executive only)
  async getFeedbackStats(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    resolved: number;
    closed: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.isExecutive()) {
        throw new Error('Not authorized to view feedback statistics');
      }

      const allFeedback = await this.getAllFeedback();
      
      const stats = {
        total: allFeedback.length,
        pending: allFeedback.filter(f => f.status === 'pending').length,
        reviewed: allFeedback.filter(f => f.status === 'reviewed').length,
        resolved: allFeedback.filter(f => f.status === 'resolved').length,
        closed: allFeedback.filter(f => f.status === 'closed').length,
        byCategory: {} as Record<string, number>,
        byPriority: {} as Record<string, number>
      };

      // Category stats
      allFeedback.forEach(feedback => {
        stats.byCategory[feedback.category] = (stats.byCategory[feedback.category] || 0) + 1;
      });

      // Priority stats
      allFeedback.forEach(feedback => {
        stats.byPriority[feedback.priority] = (stats.byPriority[feedback.priority] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting feedback statistics:', error);
      throw new Error('Failed to get feedback statistics');
    }
  }
}

export const feedbackService = new FeedbackService();
export default feedbackService;
