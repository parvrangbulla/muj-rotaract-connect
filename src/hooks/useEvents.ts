import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, EventData, PastEventData } from '@/services/event.service';
import { useAuth } from '@/contexts/AuthContext';

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: string) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  pastEvents: ['pastEvents'] as const,
  pastEventsList: () => [...eventKeys.pastEvents, 'list'] as const,
  pastEventDetail: (id: string) => [...eventKeys.pastEvents, 'detail', id] as const
};

// Hook for all events
export const useEvents = () => {
  const { isGuest } = useAuth();
  
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: () => isGuest ? eventService.getGuestEvents() : eventService.getAllEvents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for events by type
export const useEventsByType = (type: EventData['type']) => {
  return useQuery({
    queryKey: eventKeys.list(`type:${type}`),
    queryFn: () => eventService.getEventsByType(type),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for events by date range
export const useEventsByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: eventKeys.list(`dateRange:${startDate}-${endDate}`),
    queryFn: () => eventService.getEventsByDateRange(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for single event
export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => eventService.getEvent(eventId),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for guest events
export const useGuestEvents = () => {
  return useQuery({
    queryKey: eventKeys.list('guest'),
    queryFn: () => eventService.getGuestEvents(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for past events
export const usePastEvents = () => {
  return useQuery({
    queryKey: eventKeys.pastEventsList(),
    queryFn: () => eventService.getAllPastEvents(),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for past events by type
export const usePastEventsByType = (eventType: 'past' | 'flagship') => {
  return useQuery({
    queryKey: eventKeys.list(`pastType:${eventType}`),
    queryFn: () => eventService.getPastEventsByType(eventType),
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for creating events
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventData: Omit<EventData, 'id' | 'createdAt' | 'updatedAt'>) =>
      eventService.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
};

// Hook for updating events
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, updates }: { eventId: string; updates: Partial<EventData> }) =>
      eventService.updateEvent(eventId, updates),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
    },
  });
};

// Hook for deleting events
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
};

// Hook for creating past events
export const useCreatePastEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventData: Omit<PastEventData, 'id' | 'createdAt' | 'updatedAt'>) =>
      eventService.createPastEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.pastEvents });
    },
  });
};

// Hook for updating past events
export const useUpdatePastEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, updates }: { eventId: string; updates: Partial<PastEventData> }) =>
      eventService.updatePastEvent(eventId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.pastEvents });
    },
  });
};

// Hook for deleting past events
export const useDeletePastEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventId: string) => eventService.deletePastEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.pastEvents });
    },
  });
};

// Real-time events hook
export const useRealtimeEvents = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isGuest } = useAuth();

  useEffect(() => {
    const unsubscribe = isGuest 
      ? eventService.subscribeToGuestEvents((events) => {
          setEvents(events);
          setLoading(false);
        })
      : eventService.subscribeToEvents((events) => {
          setEvents(events);
          setLoading(false);
        });

    return unsubscribe;
  }, [isGuest]);

  return { events, loading };
};

// Real-time past events hook
export const useRealtimePastEvents = () => {
  const [pastEvents, setPastEvents] = useState<PastEventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = eventService.subscribeToPastEvents((events) => {
      setPastEvents(events);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { pastEvents, loading };
};
