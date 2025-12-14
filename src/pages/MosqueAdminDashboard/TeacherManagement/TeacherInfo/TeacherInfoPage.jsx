import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Typography,
    Row,
    Col,
    Descriptions,
    Tag,
    Spin,
    message,
    Button,
    Avatar,
    Divider,
    Tabs,
    Table,
    Space
} from 'antd';
import {
    UserOutlined,
    ArrowLeftOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileProtectOutlined
} from '@ant-design/icons';
import { getTeacherDetails, getTeacherCourses } from '../../../../api/teacherManagement';
import './TeacherInfoPage.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const TeacherInfoPage = () => {
    const { id: teacherId } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                console.log('teacherId: ', teacherId);

                const response = await getTeacherDetails(teacherId);
                console.log('response teacher info: ', response);

                setTeacher(response.data);

                // Fetch courses
                setCoursesLoading(true);
                try {
                    const coursesResponse = await getTeacherCourses(teacherId);
                    setCourses(coursesResponse.data);
                } catch (courseError) {
                    console.error('Error fetching teacher courses:', courseError);
                    message.error('Failed to load teacher courses');
                } finally {
                    setCoursesLoading(false);
                }
            } catch (error) {
                console.error('Error fetching teacher details:', error);
                message.error('Failed to load teacher details');
            } finally {
                setLoading(false);
            }
        };

        if (teacherId) {
            fetchDetails();
        }
    }, [teacherId]);

    if (loading) {
        return (
            <div className="teacher-info-page" style={{ textAlign: 'center', marginTop: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="teacher-info-page">
                <Card>
                    <Title level={4}>Teacher not found</Title>
                    <Button onClick={() => navigate('/mosque-admin/teacher-list')}>Back to List</Button>
                </Card>
            </div>
        );
    }

    // Expertise Columns
    const expertiseColumns = [
        {
            title: 'Course Type',
            dataIndex: 'course_type',
            key: 'course_type',
        },
        {
            title: 'Max Level',
            dataIndex: 'max_memorization_level',
            key: 'max_memorization_level',
            render: (text) => text || 'N/A'
        },
        {
            title: 'Experience (Years)',
            dataIndex: 'years_experience',
            key: 'years_experience',
        },
        {
            title: 'Hourly Rate',
            dataIndex: 'hourly_rate_cents',
            key: 'hourly_rate_cents',
            render: (cents) => `$${(cents / 100).toFixed(2)}`
        },
        {
            title: 'Memorization',
            dataIndex: 'is_memorization_selected',
            key: 'is_memorization_selected',
            render: (val) => val ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
        }
    ];

    // Availability Columns
    const availabilityColumns = [
        {
            title: 'Day',
            dataIndex: 'day_of_week',
            key: 'day_of_week',
            render: text => <Tag color="blue">{text.toUpperCase()}</Tag>
        },
        {
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: 'End Time',
            dataIndex: 'end_time',
            key: 'end_time',
        }
    ];

    // Courses Columns
    const courseColumns = [
        {
            title: 'Course Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Type',
            dataIndex: 'course_type',
            key: 'course_type',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Format',
            dataIndex: 'course_format',
            key: 'course_format',
            render: (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : 'Standard'
        },
        {
            title: 'Age Group',
            dataIndex: 'target_age_group',
            key: 'target_age_group',
            render: (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : 'All'
        },
        {
            title: 'Schedule',
            key: 'schedule',
            render: (_, record) => {
                const day = record.day_of_week ? record.day_of_week.charAt(0).toUpperCase() + record.day_of_week.slice(1) : '';
                const start = record.start_time ? record.start_time.slice(0, 5) : '';
                const end = record.end_time ? record.end_time.slice(0, 5) : '';
                return (
                    <Text type="secondary">
                        <Tag color="cyan">{day}</Tag>
                        {start} - {end}
                    </Text>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (active) => (
                <Tag color={active ? 'success' : 'error'}>
                    {active ? 'Active' : 'Inactive'}
                </Tag>
            )
        }
    ];

    return (
        <div className="teacher-info-page">
            {/* Header / Profile Card */}
            <Card className="teacher-info-header">
                <Row align="middle" gutter={[24, 24]}>
                    <Col>
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/mosque-admin/teacher-list')}
                            style={{ marginRight: 16 }}
                        />
                    </Col>
                    <Col>
                        <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: teacher.gender === 'male' ? '#1890ff' : '#eb2f96' }} />
                    </Col>
                    <Col flex="auto">
                        <Title level={3} style={{ marginBottom: 0 }}>{teacher.full_name}</Title>
                        <Space>
                            <Tag color={teacher.is_active ? 'green' : 'red'}>
                                {teacher.is_active ? 'Active' : 'Inactive'}
                            </Tag>
                            <Text type="secondary">{teacher.email}</Text>
                        </Space>
                    </Col>
                    <Col>
                        <Text type="secondary">Joined: {new Date(teacher.assigned_at).toLocaleDateString()}</Text>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]}>
                {/* Left Column: Personal Info & Location */}
                <Col xs={24} lg={8}>
                    <Card title="Personal Information" bordered={false} className="info-card">
                        <Descriptions column={1} layout="vertical">
                            <Descriptions.Item label="Phone">
                                <Space><PhoneOutlined /> {teacher.phone}</Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Gender">
                                {teacher.gender ? (teacher.gender.charAt(0).toUpperCase() + teacher.gender.slice(1)) : 'Unknown'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Date of Birth">
                                {teacher.dob ? new Date(teacher.dob).toLocaleDateString() : 'N/A'}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <Title level={5}><EnvironmentOutlined /> Location</Title>
                        {teacher.location ? (
                            <Descriptions column={1} layout="vertical">
                                <Descriptions.Item label="Region">{teacher.location.region} - {teacher.location.governorate}</Descriptions.Item>
                                <Descriptions.Item label="Address">{teacher.location.address_line1}</Descriptions.Item>
                                {teacher.location.address_line2 && (
                                    <Descriptions.Item label="Address 2">{teacher.location.address_line2}</Descriptions.Item>
                                )}
                            </Descriptions>
                        ) : (
                            <Text type="secondary">No location information available.</Text>
                        )}

                        <Divider />

                        <Title level={5}><EnvironmentOutlined /> Certifications</Title>
                        {teacher.certification ? (
                            <div className="certifications-list">
                                <div className="cert-item" style={{ marginBottom: 16 }}>
                                    <Space align="start">
                                        <FileProtectOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                                        <div>
                                            <Text strong>Tajweed Certificate</Text>
                                            <div style={{ marginTop: 4 }}>
                                                {teacher.certification.has_tajweed_certificate ? (
                                                    <Tag color="success">Certified</Tag>
                                                ) : <Tag color="default">Not Certified</Tag>}
                                            </div>
                                            {teacher.certification.tajweed_certificate_url && (
                                                <a href={teacher.certification.tajweed_certificate_url} target="_blank" rel="noopener noreferrer">View Document</a>
                                            )}
                                        </div>
                                    </Space>
                                </div>
                                <div className="cert-item">
                                    <Space align="start">
                                        <FileProtectOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                                        <div>
                                            <Text strong>Sharea Certificate</Text>
                                            <div style={{ marginTop: 4 }}>
                                                {teacher.certification.has_sharea_certificate ? (
                                                    <Tag color="success">Certified</Tag>
                                                ) : <Tag color="default">Not Certified</Tag>}
                                            </div>
                                            {teacher.certification.sharea_certificate_url && (
                                                <a href={teacher.certification.sharea_certificate_url} target="_blank" rel="noopener noreferrer">View Document</a>
                                            )}
                                        </div>
                                    </Space>
                                </div>
                            </div>
                        ) : (
                            <Text type="secondary">No certification information.</Text>
                        )}
                    </Card>

                </Col>

                {/* Right Column: Expertise & Availability */}
                <Col xs={24} lg={16}>
                    <Card className="tabs-card">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Expertise & Skills" key="1">
                                <Table
                                    dataSource={teacher.expertise}
                                    columns={expertiseColumns}
                                    rowKey="course_type"
                                    pagination={false}
                                />
                            </TabPane>
                            <TabPane tab="Availability" key="2">
                                <Paragraph>
                                    Weekly schedule availability for this teacher.
                                </Paragraph>
                                <Table
                                    dataSource={teacher.availability}
                                    columns={availabilityColumns}
                                    rowKey={(record) => `${record.day_of_week}-${record.start_time}`}
                                    pagination={false}
                                />
                            </TabPane>
                            <TabPane tab="Courses" key="3">
                                <Table
                                    dataSource={courses}
                                    columns={courseColumns}
                                    rowKey="id"
                                    loading={coursesLoading}
                                    pagination={{ pageSize: 5 }}
                                />
                            </TabPane>
                        </Tabs>
                    </Card>

                </Col>
            </Row>
        </div >
    );
};

export default TeacherInfoPage;
