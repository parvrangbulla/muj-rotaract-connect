import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface EventData {
  id?: string;
  title: string;
  description: string;
  type: 'gbm' | 'meeting' | 'working-team' | 'gbm-event';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  domain?: 'CSD' | 'CMD' | 'ISD' | 'PDD';
  eventCategory?: 'working-team' | 'gbm';
  enableRegistration: boolean;
  enableAttendance: boolean;
  maxParticipants?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  showOnGuestCalendar: boolean;
  bannerUrl?: string;
  galleryUrls?: string[];
  meetingMinutes?: string;
  venue?: string;
  impact?: string;
  shortDescription?: string;
}

export interface PastEventData {
  id?: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  category: string;
  domain?: string;
  eventType: 'past' | 'flagship';
  venue?: string;
  impact?: string;
  images: Array<{ id: string; url: string; name: string; isCover?: boolean }>;
  bannerUrl?: string;
  galleryUrls?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

class EventService {
  private eventsCollection = collection(db, 'events');
  private pastEventsCollection = collection(db, 'pastEvents');

  // Create new event
  async createEvent(eventData: Omit<EventData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const newEvent = {
        ...eventData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      const docRef = await addDoc(this.eventsCollection, newEvent);
      return docRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  // Update event
  async updateEvent(eventId: string, updates: Partial<EventData>): Promise<void> {
    try {
      const eventDoc = doc(this.eventsCollection, eventId);
      await updateDoc(eventDoc, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  // Delete event
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.eventsCollection, eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  // Get all events
  async getAllEvents(): Promise<EventData[]> {
    try {
      const querySnapshot = await getDocs(
        query(this.eventsCollection, orderBy('date', 'desc'))
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EventData));
    } catch (error) {
      console.error('Error getting events:', error);
      throw new Error('Failed to get events');
    }
  }

  // Get events by type
  async getEventsByType(type: EventData['type']): Promise<EventData[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.eventsCollection,
          where('type', '==', type),
          orderBy('date', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EventData));
    } catch (error) {
      console.error('Error getting events by type:', error);
      throw new Error('Failed to get events');
    }
  }

  // Get events for guest calendar (GBM and GBM events only)
  async getGuestEvents(): Promise<EventData[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.eventsCollection,
          where('showOnGuestCalendar', '==', true),
          orderBy('date', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EventData));
    } catch (error) {
      console.error('Error getting guest events:', error);
      throw new Error('Failed to get guest events');
    }
  }

  // Get events by date range
  async getEventsByDateRange(startDate: string, endDate: string): Promise<EventData[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.eventsCollection,
          where('date', '>=', startDate),
          where('date', '<=', endDate),
          orderBy('date', 'asc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EventData));
    } catch (error) {
      console.error('Error getting events by date range:', error);
      throw new Error('Failed to get events');
    }
  }

  // Get single event
  async getEvent(eventId: string): Promise<EventData | null> {
    try {
      const eventDoc = await getDoc(doc(this.eventsCollection, eventId));
      if (eventDoc.exists()) {
        return {
          id: eventDoc.id,
          ...eventDoc.data()
        } as EventData;
      }
      return null;
    } catch (error) {
      console.error('Error getting event:', error);
      throw new Error('Failed to get event');
    }
  }

  // Real-time listener for events
  subscribeToEvents(callback: (events: EventData[]) => void): () => void {
    const q = query(this.eventsCollection, orderBy('date', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EventData));
      
      callback(events);
    });
  }

  // Real-time listener for guest events
  subscribeToGuestEvents(callback: (events: EventData[]) => void): () => void {
    const q = query(
      this.eventsCollection,
      where('showOnGuestCalendar', '==', true),
      orderBy('date', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EventData));
      
      callback(events);
    });
  }

  // Past Events Management
  async createPastEvent(eventData: Omit<PastEventData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const newEvent = {
        ...eventData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(this.pastEventsCollection, newEvent);
      return docRef.id;
    } catch (error) {
      console.error('Error creating past event:', error);
      throw new Error('Failed to create past event');
    }
  }

  async updatePastEvent(eventId: string, updates: Partial<PastEventData>): Promise<void> {
    try {
      const eventDoc = doc(this.pastEventsCollection, eventId);
      await updateDoc(eventDoc, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating past event:', error);
      throw new Error('Failed to update past event');
    }
  }

  async deletePastEvent(eventId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.pastEventsCollection, eventId));
    } catch (error) {
      console.error('Error deleting past event:', error);
      throw new Error('Failed to delete past event');
    }
  }

  async getAllPastEvents(): Promise<PastEventData[]> {
    try {
      const querySnapshot = await getDocs(
        query(this.pastEventsCollection, orderBy('date', 'desc'))
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PastEventData));
    } catch (error) {
      console.error('Error getting past events:', error);
      throw new Error('Failed to get past events');
    }
  }

  async getPastEventsByType(eventType: 'past' | 'flagship'): Promise<PastEventData[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.pastEventsCollection,
          where('eventType', '==', eventType),
          orderBy('date', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PastEventData));
    } catch (error) {
      console.error('Error getting past events by type:', error);
      throw new Error('Failed to get past events');
    }
  }

  // Subscribe to past events
  subscribeToPastEvents(callback: (events: PastEventData[]) => void): () => void {
    const q = query(this.pastEventsCollection, orderBy('date', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PastEventData));
      
      callback(events);
    });
  }
}

export const eventService = new EventService();
export default eventService;
