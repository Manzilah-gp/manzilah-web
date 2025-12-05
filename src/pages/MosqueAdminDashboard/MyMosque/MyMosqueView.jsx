import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    CardHeader,
    Badge,
    Flex,
    Icon,
    Spinner,
    Alert,
    AlertIcon,
    AlertDescription,
    useToast,
    Divider,
    Avatar,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Grid,
    GridItem,
    Tag
} from '@chakra-ui/react';
import {
    EditOutlined,
    TeamOutlined,
    BookOutlined,
    UserOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    PlusOutlined,
    EyeOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import { getMosqueById } from '../../../api/mosque';
import { getCoursesByMosque } from '../../../api/course';
import useAuth from '../../../hooks/useAuth';
import './MyMosqueView.css';

const MyMosqueView = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();

    const [mosque, setMosque] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCourses: 0,
        activeCourses: 0,
        totalStudents: 0,
        totalTeachers: 0
    });

    useEffect(() => {
        fetchMosqueData();
    }, []);

    const fetchMosqueData = async () => {
        try {
            setLoading(true);

            // Get mosque ID from user context
            // In a real implementation, you'd get this from your API
            const mosqueId = user.mosque_id || await getMosqueIdForAdmin();

            if (!mosqueId) {
                toast({
                    title: 'Error',
                    description: 'Mosque not found for this admin',
                    status: 'error',
                    duration: 3000,
                });
                return;
            }

            // Fetch mosque details
            const mosqueResponse = await getMosqueById(mosqueId);
            if (mosqueResponse.data) {
                setMosque(mosqueResponse.data);
            }

            // Fetch courses for statistics
            const coursesResponse = await getCoursesByMosque(mosqueId);
            if (coursesResponse.data) {
                const coursesData = coursesResponse.data;
                setCourses(coursesData);

                // Calculate statistics
                const totalStudents = coursesData.reduce(
                    (sum, course) => sum + (course.enrolled_students || 0),
                    0
                );
                const activeCourses = coursesData.filter(c => c.is_active).length;
                const teachersSet = new Set(
                    coursesData
                        .filter(c => c.teacher_id)
                        .map(c => c.teacher_id)
                );

                setStats({
                    totalCourses: coursesData.length,
                    activeCourses,
                    totalStudents,
                    totalTeachers: teachersSet.size
                });
            }
        } catch (error) {
            console.error('Error fetching mosque data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load mosque data',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Placeholder - implement proper API call
    const getMosqueIdForAdmin = async () => {
        // This should call your backend API
        return 1; // Placeholder
    };

    const handleEditMosque = () => {
        if (mosque) {
            navigate(`/dashboard/edit-mosque/${mosque.id}`);
        }
    };

    const handleAddCourse = () => {
        navigate('/dashboard/mosque-admin/courses/create');
    };

    const handleViewCourses = () => {
        navigate('/dashboard/mosque-admin/courses');
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" h="400px">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    if (!mosque) {
        return (
            <Box p={8}>
                <Alert status="error">
                    <AlertIcon />
                    <AlertDescription>
                        Mosque not found. Please contact system administrator.
                    </AlertDescription>
                </Alert>
            </Box>
        );
    }

    return (
        <Box className="my-mosque-container" p={6} maxW="1400px" mx="auto">
            {/* Header Section */}
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Heading size="lg" mb={2}>
                        {mosque.name}
                    </Heading>
                    <Text color="gray.600">
                        Manage your mosque details, courses, and activities
                    </Text>
                </Box>
                <Button
                    leftIcon={<EditOutlined />}
                    colorScheme="blue"
                    onClick={handleEditMosque}
                >
                    Edit Mosque
                </Button>
            </Flex>

            {/* Statistics Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
                <Card className="stat-card stat-card-courses">
                    <CardBody>
                        <Stat>
                            <StatLabel>
                                <HStack spacing={2}>
                                    <Icon as={BookOutlined} />
                                    <Text>Total Courses</Text>
                                </HStack>
                            </StatLabel>
                            <StatNumber fontSize="3xl" color="white">
                                {stats.totalCourses}
                            </StatNumber>
                            <StatHelpText color="whiteAlpha.900">
                                {stats.activeCourses} active
                            </StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>

                <Card className="stat-card stat-card-students">
                    <CardBody>
                        <Stat>
                            <StatLabel>
                                <HStack spacing={2}>
                                    <Icon as={TeamOutlined} />
                                    <Text>Total Students</Text>
                                </HStack>
                            </StatLabel>
                            <StatNumber fontSize="3xl" color="white">
                                {stats.totalStudents}
                            </StatNumber>
                            <StatHelpText color="whiteAlpha.900">
                                Enrolled across all courses
                            </StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>

                <Card className="stat-card stat-card-teachers">
                    <CardBody>
                        <Stat>
                            <StatLabel>
                                <HStack spacing={2}>
                                    <Icon as={UserOutlined} />
                                    <Text>Active Teachers</Text>
                                </HStack>
                            </StatLabel>
                            <StatNumber fontSize="3xl" color="white">
                                {stats.totalTeachers}
                            </StatNumber>
                            <StatHelpText color="whiteAlpha.900">
                                Teaching staff
                            </StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>

                <Card className="stat-card stat-card-status">
                    <CardBody>
                        <Stat>
                            <StatLabel>
                                <HStack spacing={2}>
                                    <Icon as={BarChartOutlined} />
                                    <Text>Mosque Status</Text>
                                </HStack>
                            </StatLabel>
                            <Badge colorScheme="green" fontSize="lg" mt={2}>
                                Active
                            </Badge>
                            <StatHelpText color="gray.600" mt={2}>
                                All systems operational
                            </StatHelpText>
                        </Stat>
                    </CardBody>
                </Card>
            </SimpleGrid>

            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
                {/* Mosque Details Card */}
                <GridItem>
                    <Card className="mosque-details-card">
                        <CardHeader>
                            <Heading size="md">
                                <Icon as={EnvironmentOutlined} mr={2} />
                                Mosque Details
                            </Heading>
                        </CardHeader>
                        <CardBody>
                            <VStack spacing={4} align="stretch">
                                <Box>
                                    <Text fontWeight="600" fontSize="sm" color="gray.600" mb={1}>
                                        Location
                                    </Text>
                                    <HStack>
                                        <Icon as={EnvironmentOutlined} color="blue.500" />
                                        <Text>
                                            {mosque.address || 'No address provided'}
                                        </Text>
                                    </HStack>
                                    {mosque.governorate && (
                                        <HStack mt={2}>
                                            <Tag colorScheme="blue">{mosque.governorate}</Tag>
                                            {mosque.region && <Tag>{mosque.region}</Tag>}
                                        </HStack>
                                    )}
                                </Box>

                                <Divider />

                                <Box>
                                    <Text fontWeight="600" fontSize="sm" color="gray.600" mb={1}>
                                        Contact Information
                                    </Text>
                                    {mosque.contact_number ? (
                                        <HStack>
                                            <Icon as={PhoneOutlined} color="green.500" />
                                            <Text>{mosque.contact_number}</Text>
                                        </HStack>
                                    ) : (
                                        <Text color="gray.500" fontSize="sm">
                                            No contact number provided
                                        </Text>)}
                                </Box>

                                <Divider />

                                <Box>
                                    <Text fontWeight="600" fontSize="sm" color="gray.600" mb={1}>
                                        Administrator
                                    </Text>
                                    <HStack>
                                        <Avatar name={user.full_name} size="sm" />
                                        <Box>
                                            <Text fontWeight="500">{user.full_name}</Text>
                                            <Text fontSize="sm" color="gray.600">
                                                {user.email}
                                            </Text>
                                        </Box>
                                    </HStack>
                                </Box>

                                {mosque.latitude && mosque.longitude && (
                                    <>
                                        <Divider />
                                        <Box>
                                            <Text fontWeight="600" fontSize="sm" color="gray.600" mb={2}>
                                                Coordinates
                                            </Text>
                                            <HStack spacing={4} fontSize="sm">
                                                <Text>
                                                    <strong>Lat:</strong> {parseFloat(mosque.latitude).toFixed(6)}
                                                </Text>
                                                <Text>
                                                    <strong>Lng:</strong> {parseFloat(mosque.longitude).toFixed(6)}
                                                </Text>
                                            </HStack>
                                        </Box>
                                    </>
                                )}
                            </VStack>
                        </CardBody>
                    </Card>
                </GridItem>

                {/* Quick Actions Card */}
                <GridItem>
                    <Card className="quick-actions-card">
                        <CardHeader>
                            <Heading size="md">Quick Actions</Heading>
                        </CardHeader>
                        <CardBody>
                            <VStack spacing={3} align="stretch">
                                <Button
                                    leftIcon={<PlusOutlined />}
                                    colorScheme="blue"
                                    size="lg"
                                    onClick={handleAddCourse}
                                    w="100%"
                                >
                                    Add New Course
                                </Button>

                                <Button
                                    leftIcon={<EyeOutlined />}
                                    variant="outline"
                                    colorScheme="blue"
                                    size="lg"
                                    onClick={handleViewCourses}
                                    w="100%"
                                >
                                    View All Courses
                                </Button>

                                <Divider />

                                <Box p={4} bg="blue.50" borderRadius="md">
                                    <Text fontSize="sm" fontWeight="600" color="blue.800" mb={2}>
                                        💡 Quick Tip
                                    </Text>
                                    <Text fontSize="sm" color="blue.700">
                                        Keep your mosque information up to date to help students and parents find your courses easily.
                                    </Text>
                                </Box>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Recent Activity Card */}
                    <Card mt={6}>
                        <CardHeader>
                            <Heading size="md">Recent Activity</Heading>
                        </CardHeader>
                        <CardBody>
                            <VStack spacing={3} align="stretch">
                                {courses.slice(0, 3).map((course) => (
                                    <Box
                                        key={course.id}
                                        p={3}
                                        bg="gray.50"
                                        borderRadius="md"
                                        borderLeft="3px solid"
                                        borderLeftColor="blue.500"
                                    >
                                        <Text fontWeight="600" fontSize="sm">
                                            {course.name}
                                        </Text>
                                        <Text fontSize="xs" color="gray.600">
                                            {course.enrolled_students || 0} students enrolled
                                        </Text>
                                    </Box>
                                ))}
                                {courses.length === 0 && (
                                    <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                                        No courses yet. Create your first course!
                                    </Text>
                                )}
                            </VStack>
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>
        </Box>
    );
};
export default MyMosqueView;