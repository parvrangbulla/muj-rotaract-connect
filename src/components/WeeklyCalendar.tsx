
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventCalendar from './EventCalendar';

const WeeklyCalendar = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Calendar</h2>
          <p className="text-gray-600">View upcoming events, GBMs, and meetings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <EventCalendar />
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyCalendar;
