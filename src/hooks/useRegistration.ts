import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationService, Registration, AttendanceRecord } from '@/services/registration.service';
import { useAuth } from '@/contexts/AuthContext';

// Query keys
export const registrationKeys = {
  all: ['registrations'] as const,
  lists: () => [...registrationKeys.all, 'list'] as const,
  list: (filters: string) => [...registrationKeys.lists(), { filters }] as const,
  details: () => [...registrationKeys.all, 'detail'] as const,
  detail: (id: string) => [...registrationKeys.details(), id] as const,
  attendance: ['attendance'] as const,
  attendanceList: (eventId: string) => [...registrationKeys.attendance, 'list', eventId] as const,
  userRegistrations: (userId: string) => [...registrationKeys.all, 'user', userId] as const,
  userAttendance: (userId: string) => [...registrationKeys.attendance, 'user', userId] as const,
  eventRegistrations: (eventId: string) => [...registrationKeys.all, 'event', eventId] as const,
};

// Hook for user's registrations
export const useUserRegistrations = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.uid;

  return useQuery({
    queryKey: registrationKeys.userRegistrations(targetUserId || ''),
    queryFn: () => registrationService.getUserRegistrations(targetUserId!),
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for user's attendance records
export const useUserAttendance = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.uid;

  return useQuery({
    queryKey: registrationKeys.userAttendance(targetUserId || ''),
    queryFn: () => registrationService.getUserAttendance(targetUserId!),
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for event registrations
export const useEventRegistrations = (eventId: string) => {
  return useQuery({
    queryKey: registrationKeys.eventRegistrations(eventId),
    queryFn: () => registrationService.getEventRegistrations(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes for more real-time feel
  });
};

// Hook for event attendance
export const useEventAttendance = (eventId: string) => {
  return useQuery({
    queryKey: registrationKeys.attendanceList(eventId),
    queryFn: () => registrationService.getEventAttendance(eventId),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook for user's registration for specific event
export const useUserEventRegistration = (eventId: string, userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.uid;

  return useQuery({
    queryKey: registrationKeys.list(`user:${targetUserId}-event:${eventId}`),
    queryFn: () => registrationService.getUserRegistrationForEvent(eventId, targetUserId!),
    enabled: !!eventId && !!targetUserId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook for registering for event
export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ eventId, additionalInfo }: { eventId: string; additionalInfo?: Record<string, any> }) =>
      registrationService.registerForEvent(eventId, additionalInfo),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.eventRegistrations(eventId) });
      if (user) {
        queryClient.invalidateQueries({ queryKey: registrationKeys.userRegistrations(user.uid) });
      }
    },
  });
};

// Hook for canceling registration
export const useCancelRegistration = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (registrationId: string) => registrationService.cancelRegistration(registrationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.all });
      if (user) {
        queryClient.invalidateQueries({ queryKey: registrationKeys.userRegistrations(user.uid) });
      }
    },
  });
};

// Hook for updating registration status (Executive only)
export const useUpdateRegistrationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      registrationId, 
      status, 
      notes 
    }: { 
      registrationId: string; 
      status: 'approved' | 'rejected'; 
      notes?: string 
    }) => registrationService.updateRegistrationStatus(registrationId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.all });
      queryClient.invalidateQueries({ queryKey: registrationKeys.attendance });
    },
  });
};

// Hook for marking attendance (Executive only)
export const useMarkAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      attendanceId, 
      status, 
      serviceHours, 
      notes 
    }: { 
      attendanceId: string; 
      status: 'present' | 'absent'; 
      serviceHours?: number; 
      notes?: string 
    }) => registrationService.markAttendance(attendanceId, status, serviceHours, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.attendance });
    },
  });
};

// Hook for adding participant manually (Executive only)
export const useAddParticipantManually = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      eventId, 
      userEmail, 
      userName, 
      additionalInfo 
    }: { 
      eventId: string; 
      userEmail: string; 
      userName: string; 
      additionalInfo?: Record<string, any> 
    }) => registrationService.addParticipantManually(eventId, userEmail, userName, additionalInfo),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.eventRegistrations(eventId) });
      queryClient.invalidateQueries({ queryKey: registrationKeys.attendanceList(eventId) });
    },
  });
};

// Real-time event registrations hook
export const useRealtimeEventRegistrations = (eventId: string) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const unsubscribe = registrationService.subscribeToEventRegistrations(eventId, (registrations) => {
      setRegistrations(registrations);
      setLoading(false);
    });

    return unsubscribe;
  }, [eventId]);

  return { registrations, loading };
};

// Real-time event attendance hook
export const useRealtimeEventAttendance = (eventId: string) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const unsubscribe = registrationService.subscribeToEventAttendance(eventId, (attendance) => {
      setAttendance(attendance);
      setLoading(false);
    });

    return unsubscribe;
  }, [eventId]);

  return { attendance, loading };
};

// Hook for exporting attendance to CSV
export const useExportAttendance = () => {
  return useMutation({
    mutationFn: async ({ 
      eventId, 
      registrations, 
      attendance 
    }: { 
      eventId: string; 
      registrations: Registration[]; 
      attendance: AttendanceRecord[] 
    }) => {
      const csvContent = registrationService.exportAttendanceToCSV(eventId, registrations, attendance);
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attendance-${eventId}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return csvContent;
    },
  });
};

// Helper hook to get registration status for current user and event
export const useRegistrationStatus = (eventId: string) => {
  const { user } = useAuth();
  const { data: registration, isLoading } = useUserEventRegistration(eventId, user?.uid);

  return {
    isRegistered: !!registration,
    registration,
    isLoading,
    status: registration?.status,
    canRegister: !registration && user?.role !== 'guest'
  };
};
