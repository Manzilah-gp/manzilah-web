

import { useState, useEffect } from 'react';
import { message } from 'antd';

const useUserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const transformEventToCalendar = (event) => {
    console.log('\n========================================');
    console.log(' DIAGNOSING EVENT:', event.title);
    console.log('========================================');
    
    // Step 1: Show raw data from backend
    console.log(' RAW DATA FROM BACKEND:');
    console.log('  event_date:', event.event_date, '(type:', typeof event.event_date, ')');
    console.log('  event_time:', event.event_time, '(type:', typeof event.event_time, ')');
    
    // Step 2: Check what the date looks like
    console.log('\n ANALYZING DATE STRING:');
    console.log('  Full string:', JSON.stringify(event.event_date));
    console.log('  Length:', event.event_date?.length);
    console.log('  Contains T?', event.event_date?.includes('T'));
    console.log('  Contains Z?', event.event_date?.includes('Z'));
    
    // Step 3: Extract date part
    let dateOnly;
    if (event.event_date.includes('T')) {
      dateOnly = event.event_date.split('T')[0];
      console.log('   Split at T:', dateOnly);
    } else {
      dateOnly = event.event_date;
      console.log('   Already clean:', dateOnly);
    }
    
    // Step 4: Check what the time looks like
    console.log('\n ANALYZING TIME STRING:');
    if (event.event_time) {
      console.log('  Full string:', JSON.stringify(event.event_time));
      console.log('  Length:', event.event_time?.length);
      console.log('  Contains T?', event.event_time?.includes('T'));
      console.log('  Contains .?', event.event_time?.includes('.'));
      
      // Extract time part
      let timeOnly = event.event_time;
      
      if (timeOnly.includes('.')) {
        timeOnly = timeOnly.split('.')[0];
        console.log('   Remove milliseconds:', timeOnly);
      }
      if (timeOnly.includes('T')) {
        timeOnly = timeOnly.split('T')[1];
        console.log('   Split at T:', timeOnly);
      }
      
      console.log('   Final time:', timeOnly);
      
      // Combine date and time
      const startDate = `${dateOnly}T${timeOnly}`;
      console.log('\n COMBINED STRING:', startDate);
      
      // Test what JavaScript does with this date
      const testDate = new Date(startDate);
      console.log('\n JAVASCRIPT DATE OBJECT TEST:');
      console.log('  Created:', testDate);
      console.log('  ISO String:', testDate.toISOString());
      console.log('  Local String:', testDate.toLocaleString());
      console.log('  Date only:', testDate.toLocaleDateString());
      console.log('  Timezone offset:', testDate.getTimezoneOffset(), 'minutes');
      
      // Show what FullCalendar will receive
      console.log('\n WHAT FULLCALENDAR RECEIVES:');
      console.log('  start:', startDate);
      console.log('  allDay:', false);
      
      const transformed = {
        id: event.id.toString(),
        title: event.title,
        start: startDate,
        allDay: false,
        backgroundColor: getEventColor(event.event_type),
        borderColor: getEventColor(event.event_type),
        extendedProps: {
          description: event.description,
          location: event.location,
          mosque_name: event.mosque_name,
          event_type: event.event_type,
          event_time: timeOnly,
          event_date: dateOnly
        }
      };
      
      console.log('\n FINAL TRANSFORMED EVENT:');
      console.log(JSON.stringify(transformed, null, 2));
      console.log('========================================\n');
      
      return transformed;
      
    } else {
      // All-day event
      console.log('  No time - all-day event');
      console.log('\n USING DATE ONLY:', dateOnly);
      
      const transformed = {
        id: event.id.toString(),
        title: event.title,
        start: dateOnly,
        allDay: true,
        backgroundColor: getEventColor(event.event_type),
        borderColor: getEventColor(event.event_type),
        extendedProps: {
          description: event.description,
          location: event.location,
          mosque_name: event.mosque_name,
          event_type: event.event_type,
          event_time: null,
          event_date: dateOnly
        }
      };
      
      console.log('\n FINAL TRANSFORMED EVENT:');
      console.log(JSON.stringify(transformed, null, 2));
      console.log('========================================\n');
      
      return transformed;
    }
  };

  /**
   * Get color based on event type
   */
  const getEventColor = (eventType) => {
    const colors = {
      religious: '#52c41a',
      educational: '#1890ff',
      social: '#722ed1',
      fundraising: '#fa8c16'
    };
    return colors[eventType] || '#1890ff';
  };


  const fetchEvents = async () => {
    console.log('========================================');
    console.log(' FETCHING USER CALENDAR EVENTS');
    console.log('========================================');
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const url = 'http://localhost:5000/api/events/user/calendar';
      console.log('📡 Fetching from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(' Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('\n FULL BACKEND RESPONSE:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.success && data.events) {
        if (data.events.length > 0) {
          console.log(`\n TRANSFORMING ${data.events.length} EVENTS...\n`);
          
          const calendarEvents = data.events.map(transformEventToCalendar);
          
          setEvents(calendarEvents);
          console.log('\n ALL EVENTS TRANSFORMED AND SET');
        } else {
          console.log(' No events returned from backend');
          setEvents([]);
        }
      } else {
        console.error(' Backend error:', data.message);
        setError(data.message || 'Failed to load events');
      }
      
      setLoading(false);
      
    } catch (err) {
      console.error(' FETCH ERROR:', err);
      setError('Failed to load events: ' + err.message);
      message.error('Failed to load calendar events');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
};

export default useUserEvents;