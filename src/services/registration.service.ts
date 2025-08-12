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
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authService } from './auth.service';

export interface Registration {
  id?: string;
  eventId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  registrationNumber?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  additionalInfo?: Record<string, any>;
}

export interface AttendanceRecord {
  id?: string;
  eventId: string;
  userId: string;
  registrationId: string;
  status: 'present' | 'absent' | 'pending';
  markedBy?: string;
  markedAt?: Date;
  serviceHoursAwarded?: number;
  notes?: string;
}

class RegistrationService {
  private registrationsCollection = collection(db, 'registrations');
  private attendanceCollection = collection(db, 'attendance');

  // Register for event
  async registerForEvent(
    eventId: string, 
    additionalInfo?: Record<string, any>
  ): Promise<string> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (currentUser.role === 'guest') {
        throw new Error('Guests cannot register for events');
      }

      // Check if already registered
      const existingRegistration = await this.getUserRegistrationForEvent(eventId, currentUser.uid);
      if (existingRegistration) {
        throw new Error('Already registered for this event');
      }

      const registration: Omit<Registration, 'id'> = {
        eventId,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.fullName,
        userPhone: currentUser.phone,
        registrationNumber: currentUser.registrationNumber,
        status: 'pending',
        registeredAt: new Date(),
        additionalInfo
      };

      const docRef = await addDoc(this.registrationsCollection, registration);
      return docRef.id;
    } catch (error) {
      console.error('Error registering for event:', error);
      throw new Error('Failed to register for event');
    }
  }

  // Cancel registration
  async cancelRegistration(registrationId: string): Promise<void> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const registration = await this.getRegistration(registrationId);
      if (!registration) {
        throw new Error('Registration not found');
      }

      if (registration.userId !== currentUser.uid && !authService.isExecutive()) {
        throw new Error('Not authorized to cancel this registration');
      }

      await deleteDoc(doc(this.registrationsCollection, registrationId));
    } catch (error) {
      console.error('Error canceling registration:', error);
      throw new Error('Failed to cancel registration');
    }
  }

  // Approve/Reject registration (Executive only)
  async updateRegistrationStatus(
    registrationId: string, 
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<void> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.isExecutive()) {
        throw new Error('Not authorized to update registration status');
      }

      const updates = {
        status,
        approvedBy: currentUser.uid,
        approvedAt: new Date(),
        notes
      };

      await updateDoc(doc(this.registrationsCollection, registrationId), updates);

      // If approved, create attendance record
      if (status === 'approved') {
        const registration = await this.getRegistration(registrationId);
        if (registration) {
          await this.createAttendanceRecord(registration.eventId, registration.userId, registrationId);
        }
      }
    } catch (error) {
      console.error('Error updating registration status:', error);
      throw new Error('Failed to update registration status');
    }
  }

  // Get user's registration for specific event
  async getUserRegistrationForEvent(eventId: string, userId: string): Promise<Registration | null> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.registrationsCollection,
          where('eventId', '==', eventId),
          where('userId', '==', userId)
        )
      );

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Registration;
      }

      return null;
    } catch (error) {
      console.error('Error getting user registration:', error);
      throw new Error('Failed to get registration');
    }
  }

  // Get all registrations for an event
  async getEventRegistrations(eventId: string): Promise<Registration[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.registrationsCollection,
          where('eventId', '==', eventId),
          orderBy('registeredAt', 'desc')
        )
      );

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Registration));
    } catch (error) {
      console.error('Error getting event registrations:', error);
      throw new Error('Failed to get event registrations');
    }
  }

  // Get user's registrations
  async getUserRegistrations(userId: string): Promise<Registration[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.registrationsCollection,
          where('userId', '==', userId),
          orderBy('registeredAt', 'desc')
        )
      );

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Registration));
    } catch (error) {
      console.error('Error getting user registrations:', error);
      throw new Error('Failed to get user registrations');
    }
  }

  // Get single registration
  async getRegistration(registrationId: string): Promise<Registration | null> {
    try {
      const registrationDoc = await getDoc(doc(this.registrationsCollection, registrationId));
      if (registrationDoc.exists()) {
        return {
          id: registrationDoc.id,
          ...registrationDoc.data()
        } as Registration;
      }
      return null;
    } catch (error) {
      console.error('Error getting registration:', error);
      throw new Error('Failed to get registration');
    }
  }

  // Create attendance record
  async createAttendanceRecord(eventId: string, userId: string, registrationId: string): Promise<string> {
    try {
      const attendanceRecord: Omit<AttendanceRecord, 'id'> = {
        eventId,
        userId,
        registrationId,
        status: 'pending'
      };

      const docRef = await addDoc(this.attendanceCollection, attendanceRecord);
      return docRef.id;
    } catch (error) {
      console.error('Error creating attendance record:', error);
      throw new Error('Failed to create attendance record');
    }
  }

  // Mark attendance (Executive only)
  async markAttendance(
    attendanceId: string, 
    status: 'present' | 'absent',
    serviceHours: number = 2,
    notes?: string
  ): Promise<void> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.isExecutive()) {
        throw new Error('Not authorized to mark attendance');
      }

      const updates = {
        status,
        markedBy: currentUser.uid,
        markedAt: new Date(),
        serviceHoursAwarded: status === 'present' ? serviceHours : 0,
        notes
      };

      await updateDoc(doc(this.attendanceCollection, attendanceId), updates);

      // Award service hours if present
      if (status === 'present') {
        const attendance = await this.getAttendanceRecord(attendanceId);
        if (attendance) {
          await authService.addServiceHours(attendance.userId, serviceHours);
        }
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw new Error('Failed to mark attendance');
    }
  }

  // Get attendance records for event
  async getEventAttendance(eventId: string): Promise<AttendanceRecord[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.attendanceCollection,
          where('eventId', '==', eventId)
        )
      );

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AttendanceRecord));
    } catch (error) {
      console.error('Error getting event attendance:', error);
      throw new Error('Failed to get event attendance');
    }
  }

  // Get user's attendance records
  async getUserAttendance(userId: string): Promise<AttendanceRecord[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.attendanceCollection,
          where('userId', '==', userId)
        )
      );

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AttendanceRecord));
    } catch (error) {
      console.error('Error getting user attendance:', error);
      throw new Error('Failed to get user attendance');
    }
  }

  // Get single attendance record
  async getAttendanceRecord(attendanceId: string): Promise<AttendanceRecord | null> {
    try {
      const attendanceDoc = await getDoc(doc(this.attendanceCollection, attendanceId));
      if (attendanceDoc.exists()) {
        return {
          id: attendanceDoc.id,
          ...attendanceDoc.data()
        } as AttendanceRecord;
      }
      return null;
    } catch (error) {
      console.error('Error getting attendance record:', error);
      throw new Error('Failed to get attendance record');
    }
  }

  // Add participant manually (Executive only)
  async addParticipantManually(
    eventId: string,
    userEmail: string,
    userName: string,
    additionalInfo?: Record<string, any>
  ): Promise<string> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !authService.isExecutive()) {
        throw new Error('Not authorized to add participants manually');
      }

      const registration: Omit<Registration, 'id'> = {
        eventId,
        userId: 'manual-' + Date.now(),
        userEmail,
        userName,
        status: 'approved',
        registeredAt: new Date(),
        approvedBy: currentUser.uid,
        approvedAt: new Date(),
        additionalInfo
      };

      const docRef = await addDoc(this.registrationsCollection, registration);
      
      // Create attendance record
      await this.createAttendanceRecord(eventId, registration.userId, docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding participant manually:', error);
      throw new Error('Failed to add participant');
    }
  }

  // Subscribe to event registrations
  subscribeToEventRegistrations(eventId: string, callback: (registrations: Registration[]) => void): () => void {
    const q = query(
      this.registrationsCollection,
      where('eventId', '==', eventId),
      orderBy('registeredAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const registrations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Registration));
      
      callback(registrations);
    });
  }

  // Subscribe to event attendance
  subscribeToEventAttendance(eventId: string, callback: (attendance: AttendanceRecord[]) => void): () => void {
    const q = query(
      this.attendanceCollection,
      where('eventId', '==', eventId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const attendance = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AttendanceRecord));
      
      callback(attendance);
    });
  }

  // Export attendance to CSV format
  exportAttendanceToCSV(eventId: string, registrations: Registration[], attendance: AttendanceRecord[]): string {
    const headers = [
      'Name',
      'Email',
      'Registration Number',
      'Phone',
      'Registration Status',
      'Attendance Status',
      'Service Hours',
      'Registered At',
      'Marked At'
    ];

    const rows = registrations.map(reg => {
      const attendanceRecord = attendance.find(att => att.registrationId === reg.id);
      return [
        reg.userName,
        reg.userEmail,
        reg.registrationNumber || '',
        reg.userPhone || '',
        reg.status,
        attendanceRecord?.status || 'Not marked',
        attendanceRecord?.serviceHoursAwarded || 0,
        reg.registeredAt.toLocaleDateString(),
        attendanceRecord?.markedAt?.toLocaleDateString() || ''
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }
}

export const registrationService = new RegistrationService();
export default registrationService;
