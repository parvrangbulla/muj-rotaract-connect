
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, Calendar, Users, Award } from 'lucide-react';
import WeeklyCalendar from './WeeklyCalendar';
import EventsList from './EventsList';
import FlagshipEventsList from './FlagshipEventsList';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Dashboard</h1>
            <p className="text-gray-600">Manage events and activities</p>
          </div>
          
          {/* Instagram Link */}
          <Button
            variant="outline"
            onClick={() => window.open('https://instagram.com/rotaractclubmuj', '_blank')}
            className="border-rotaract-orange text-rotaract-orange hover:bg-rotaract-orange hover:text-white"
          >
            <Instagram className="w-4 h-4 mr-2" />
            Follow Us
          </Button>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="flagship" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Flagship Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <WeeklyCalendar />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <EventsList />
          </TabsContent>

          <TabsContent value="flagship" className="space-y-6">
            <FlagshipEventsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
