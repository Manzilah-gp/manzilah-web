// ============================================
// FILE: src/pages/Calendar/CalendarPage.jsx
// ============================================
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Spin, Alert, Select, Card, Tag, Space, Typography } from 'antd';
import { getMySchedule } from '../../api/calendar';
import useAuth from '../../hooks/useAuth';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPage.css';
import { getMeetingDetails } from '../../api/videoCalls';

const { Title, Text } = Typography;
const { Option } = Select;

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('all'); // For parent filter

    useEffect(() => {
        fetchSchedule();
    }, []);

    /**
     * Fetch schedule from backend
     */
    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const response = await getMySchedule();

            if (response.data.success) {
                const data = response.data.data;
                console.log("calender data", data);

                // Process courses into calendar events
                const calendarEvents = processScheduleData(data);
                setEvents(calendarEvents);

                // Set children if parent
                if (data.children) {
                    setChildren(data.children);
                }
            }
        } catch (err) {
            console.error('Error fetching schedule:', err);
            setError('Failed to load schedule. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Convert course schedules to calendar events
     * Uses actual course start/end dates from database
     */
    const processScheduleData = (data) => {
        const calendarEvents = [];
        const courses = data.courses || [];
        const dbEvents = data.events || [];

        // Process courses (recurring weekly based on actual dates)
        courses.forEach(course => {
            if (!course.day_of_week || !course.start_time) return;

            // Map day names to moment day numbers
            const dayMap = {
                'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
                'thursday': 4, 'friday': 5, 'saturday': 6
            };
            const dayNum = dayMap[course.day_of_week.toLowerCase()];

            // Determine course date range
            let startDate, endDate, weeksToGenerate;

            if (course.course_start_date && course.course_end_date) {
                // Use actual dates from database
                startDate = moment(course.course_start_date);
                endDate = moment(course.course_end_date);
                weeksToGenerate = Math.ceil(endDate.diff(startDate, 'weeks', true));
            } else if (course.duration_weeks) {
                // Use duration_weeks if available
                startDate = moment().day(dayNum);
                if (startDate.isBefore(moment(), 'day')) {
                    startDate.add(7, 'days');
                }
                weeksToGenerate = course.duration_weeks;
                endDate = startDate.clone().add(weeksToGenerate, 'weeks');
            } else {
                // Fallback: generate 12 weeks from today
                startDate = moment().day(dayNum);
                if (startDate.isBefore(moment(), 'day')) {
                    startDate.add(7, 'days');
                }
                weeksToGenerate = 12;
                endDate = startDate.clone().add(12, 'weeks');
            }

            // Find first occurrence of the day within course dates
            let nextDate = startDate.clone().day(dayNum);
            if (nextDate.isBefore(startDate, 'day')) {
                nextDate.add(7, 'days');
            }

            // Generate recurring events for each week within course dates
            let weekCount = 0;
            while (nextDate.isSameOrBefore(endDate, 'day') && weekCount < weeksToGenerate) {
                const [startHour, startMin] = course.start_time.split(':');
                const [endHour, endMin] = course.end_time.split(':');

                const start = nextDate.clone()
                    .hour(parseInt(startHour))
                    .minute(parseInt(startMin))
                    .toDate();

                const end = nextDate.clone()
                    .hour(parseInt(endHour))
                    .minute(parseInt(endMin))
                    .toDate();

                calendarEvents.push({
                    id: `course-${course.course_id}-${weekCount}`,
                    title: course.course_name,
                    start,
                    end,
                    resource: {
                        type: 'course',
                        ...course
                    },
                    color: course.color
                });

                nextDate.add(7, 'days');
                weekCount++;
            }
        });

        // Process one-time events (mosque admin only)
        dbEvents.forEach(event => {
            const eventDateTime = moment(event.event_date);

            if (event.event_time) {
                const [hour, min] = event.event_time.split(':');
                eventDateTime.hour(parseInt(hour)).minute(parseInt(min));
            }

            const start = eventDateTime.toDate();
            const end = eventDateTime.clone().add(2, 'hours').toDate();

            calendarEvents.push({
                id: `event-${event.event_id}`,
                title: event.title,
                start,
                end,
                resource: {
                    type: 'event',
                    ...event
                },
                color: event.color
            });
        });

        return calendarEvents;
    };

    /**
     * Filter events by selected child (parents only)
     */
    const filteredEvents = useMemo(() => {
        if (selectedChild === 'all' || !user?.roles?.includes('parent')) {
            return events;
        }

        return events.filter(event =>
            event.resource.type === 'course' &&
            event.resource.child_info?.name === children.find(c => c.id === parseInt(selectedChild))?.name
        );
    }, [events, selectedChild, children, user]);

    /**
     * Navigate to course details on event click
     */

    const handleEventClick = async (event) => {
        const { resource } = event;
        const canManageContent = user?.roles?.some(role =>
            ['mosque_admin', 'teacher', 'student'].includes(role)
        );


        if (resource.type === 'course' && canManageContent) {
            try {

                setLoading(true);
                setError(null);
                console.log("enside calender habdleEventClick");
                // Check if meeting is enabled
                const response = await getMeetingDetails(resource.course_id);
                const { isOnlineEnabled, meetingUrl, roomId } = response.data.data;

                if (!isOnlineEnabled) {
                    alert('Online meetings are not enabled for this course');
                    setLoading(false);
                    return;
                }

                // Navigate to meeting room
                navigate(`/meeting/${roomId}`);
            } catch (err) {
                console.error('Error joining meeting:', err);
                setError(err.response?.data?.message || 'Failed to join meeting');
                setLoading(false);
            }

        }
        // For events, you can add event details page later
    };

    /**
     * Custom event styling
     */
    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: event.color,
                borderColor: event.color,
                borderRadius: '4px',
                opacity: 0.9,
                color: 'white',
                border: 'none',
                display: 'block'
            }
        };
    };

    /**
     * Custom event component to show teacher name
     */
    const EventComponent = ({ event }) => (
        <div style={{ fontSize: '13px', fontWeight: '500' }}>
            <div>{event.title}</div>
            {event.resource.teacher_name && (
                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                    {event.resource.teacher_name}
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <Spin size="large" tip="Loading schedule..." />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ margin: '20px' }}
            />
        );
    }

    return (
        <div className="calendar-page">
            {/* Header */}
            <div className="calendar-header">
                <Title level={2}>
                    📅 My Schedule
                </Title>
                <Text type="secondary">
                    {user?.roles?.includes('mosque_admin') && 'All courses and events in your mosque'}
                    {user?.roles?.includes('teacher') && 'Courses you are teaching'}
                    {user?.roles?.includes('student') && 'Your enrolled courses'}
                    {user?.roles?.includes('parent') && "Your children's courses"}
                </Text>
            </div>

            {/* Parent: Children Filter */}
            {user?.roles?.includes('parent') && children.length > 0 && (
                <Card className="children-legend-card" style={{ marginBottom: '20px' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Title level={5}>Filter by Child</Title>
                        <Select
                            value={selectedChild}
                            onChange={setSelectedChild}
                            style={{ width: '250px' }}
                        >
                            <Option value="all">All Children</Option>
                            {children.map(child => (
                                <Option key={child.id} value={child.id}>
                                    <Space>
                                        <div
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: child.color,
                                                display: 'inline-block'
                                            }}
                                        />
                                        {child.name}
                                    </Space>
                                </Option>
                            ))}
                        </Select>

                        {/* Legend */}
                        <Space wrap style={{ marginTop: '10px' }}>
                            {children.map(child => (
                                <Tag
                                    key={child.id}
                                    color={child.color}
                                    style={{ marginBottom: '8px' }}
                                >
                                    {child.name}
                                </Tag>
                            ))}
                        </Space>
                    </Space>
                </Card>
            )}

            {/* Calendar */}
            <Card className="calendar-card">
                {filteredEvents.length === 0 ? (
                    <Alert
                        message="No Schedule Available"
                        description="No courses or events scheduled yet."
                        type="info"
                        showIcon
                    />
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={filteredEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '700px' }}
                        defaultView="week"
                        views={['week']}
                        onSelectEvent={handleEventClick}
                        eventPropGetter={eventStyleGetter}
                        components={{
                            event: EventComponent
                        }}
                        min={moment().hour(6).minute(0).toDate()}
                        max={moment().hour(22).minute(0).toDate()}
                        step={30}
                        timeslots={2}
                    />
                )}
            </Card>

            {/* Legend for Course Types (Non-Parents) */}
            {!user?.roles?.includes('parent') && (
                <Card style={{ marginTop: '20px' }}>
                    <Title level={5}>Course Types</Title>
                    <Space wrap>
                        <Tag color="#9b59b6">Memorization</Tag>
                        <Tag color="#3498db">Tajweed</Tag>
                        <Tag color="#2ecc71">Feqh</Tag>
                    </Space>
                    {user?.roles?.includes('mosque_admin') && (
                        <>
                            <Title level={5} style={{ marginTop: '15px' }}>Event Types</Title>
                            <Space wrap>
                                <Tag color="#e67e22">Religious</Tag>
                                <Tag color="#db34b7ff">Educational</Tag>
                                <Tag color="#1abc9c">Social</Tag>
                                <Tag color="#e74c3c">Fundraising</Tag>
                            </Space>
                        </>
                    )}
                </Card>
            )}
        </div>
    );
};

export default CalendarPage;