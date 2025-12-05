import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Heading,
    Text,
    Flex,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Badge,
    VStack,
    HStack,
    Icon,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton
} from '@chakra-ui/react';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getCoursesByMosque, deleteCourse, getMyMosqueId } from '../../../api/course.js';
import useAuth from "../../../hooks/useAuth.js"

const CourseListView = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();


    // Placeholder function - you'll need to implement this

    const getMosqueIdForAdmin = async () => {
        // This should call your API to get the mosque ID for the current admin
        const adminId = user.id;
        const response = await getMyMosqueId(adminId);
        return response.data.mosqueId;
    };

    // Fetch courses for the admin's mosque
    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);

            // In a real implementation, we'd get the mosque ID from context or API
            // For now, we'll use a placeholder - you'll need to implement the mosque ID retrieval
            const mosqueId = await getMosqueIdForAdmin();
            //localStorage.getItem('current_mosque_id') || await getMosqueIdForAdmin();

            // const mosqueId = 1;

            if (!mosqueId) {
                setError("Unable to determine mosque ID. Please ensure you're logged in as a mosque admin.");
                return;
            }

            const response = await getCoursesByMosque(mosqueId);
            setCourses(response.data || []);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load courses. Please try again.');
            toast({
                title: 'Error',
                description: 'Failed to load courses',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchCourses();
    }, []);


    const handleDeleteCourse = async (courseId, courseName) => {
        if (window.confirm(`Are you sure you want to delete "${courseName}"?`)) {
            try {
                await deleteCourse(courseId);
                toast({
                    title: 'Course Deleted',
                    description: `${courseName} has been deleted successfully`,
                    status: 'success',
                    duration: 3000,
                });
                fetchCourses(); // Refresh the list
            } catch (err) {
                navigate('/dashboard/mosque-admin/courses');
                console.error('Error deleting course:', err);
                toast({
                    title: 'Error',
                    description: 'Failed to delete course',
                    status: 'error',
                    duration: 3000,
                });
            }
        }
    };

    const handleCreateCourse = () => {
        navigate('/dashboard/mosque-admin/courses/create');
    };

    const handleViewCourse = (courseId) => {
        navigate(`/dashboard/mosque-admin/courses/${courseId}`);
    };

    const handleEditCourse = (courseId) => {
        navigate(`/dashboard/mosque-admin/courses/edit/${courseId}`);
    };

    const handleAssignTeacher = (courseId) => {
        navigate(`/dashboard/mosque-admin/courses/assign-teacher/${courseId}`);
    };


    const formatPrice = (cents) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    const getCourseTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'memorization':
                return 'purple';
            case 'tajweed':
                return 'blue';
            case 'feqh':
                return 'green';
            default:
                return 'gray';
        }
    };

    const getStatusBadge = (isActive) => {
        return (
            <Badge colorScheme={isActive ? 'green' : 'red'}>
                {isActive ? 'Active' : 'Inactive'}
            </Badge>
        );
    };

    const getGenderBadge = (targetGender) => {
        if (!targetGender) return null;

        return (
            <Badge colorScheme={targetGender === 'male' ? 'blue' : 'pink'}>
                {targetGender === 'male' ? '♂ Male Only' : '♀ Female Only'}
            </Badge>
        );
    };

    if (loading) {
        return (
            <Box p={8} textAlign="center">
                <Spinner size="xl" />
                <Text mt={4}>Loading courses...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={8}>
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button mt={4} onClick={fetchCourses}>
                    Retry
                </Button>
            </Box>
        );
    }

    if (courses.length === 0) {
        return (
            <Box p={8} textAlign="center">
                <Heading size="lg" mb={4}>
                    No Courses Found
                </Heading>
                <Text color="gray.600" mb={6}>
                    You haven't created any courses yet. Create your first course to get started.
                </Text>
                <Button
                    colorScheme="blue"
                    leftIcon={<PlusOutlined />}
                    onClick={handleCreateCourse}
                    size="lg"
                >
                    Create First Course
                </Button>
            </Box>
        );
    }

    return (
        <Box p={6}>
            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Heading size="lg" mb={2}>
                        Course Management
                    </Heading>
                    <Text color="gray.600">
                        Manage your mosque's courses and teacher assignments
                    </Text>
                </Box>
                <Button
                    colorScheme="blue"
                    leftIcon={<PlusOutlined />}
                    onClick={handleCreateCourse}
                >
                    Create New Course
                </Button>
            </Flex>

            {/* Stats Summary */}
            <Flex mb={6} gap={4} wrap="wrap">
                <Card flex="1" minW="200px">
                    <CardBody>
                        <HStack>
                            <Icon as={TeamOutlined} color="blue.500" boxSize={6} />
                            <Box>
                                <Text fontSize="sm" color="gray.600">Total Courses</Text>
                                <Heading size="lg">{courses.length}</Heading>
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>

                <Card flex="1" minW="200px">
                    <CardBody>
                        <HStack>
                            <Icon as={TeamOutlined} color="green.500" boxSize={6} />
                            <Box>
                                <Text fontSize="sm" color="gray.600">Active Courses</Text>
                                <Heading size="lg">
                                    {courses.filter(c => c.is_active).length}
                                </Heading>
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>

                <Card flex="1" minW="200px">
                    <CardBody>
                        <HStack>
                            <Icon as={ClockCircleOutlined} color="orange.500" boxSize={6} />
                            <Box>
                                <Text fontSize="sm" color="gray.600">Enrolled Students</Text>
                                <Heading size="lg">
                                    {courses.reduce((sum, course) => sum + (course.enrolled_students || 0), 0)}
                                </Heading>
                            </Box>
                        </HStack>
                    </CardBody>
                </Card>
            </Flex>

            {/* Course Cards */}
            <VStack spacing={4} align="stretch">
                {courses.map((course) => (
                    <Card
                        key={course.id}
                        borderLeft="4px"
                        borderLeftColor={getCourseTypeColor(course.course_type)}
                        _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                        transition="all 0.2s"
                    >
                        <CardBody>
                            <Flex justify="space-between" align="start" mb={4}>
                                <Box flex="1">
                                    <Flex align="center" gap={3} mb={2}>
                                        <Heading size="md">{course.name}</Heading>
                                        {getStatusBadge(course.is_active)}
                                        {getGenderBadge(course.target_gender)}
                                        <Badge colorScheme={getCourseTypeColor(course.course_type)}>
                                            {course.course_type}
                                        </Badge>
                                    </Flex>

                                    {course.description && (
                                        <Text color="gray.600" mb={3} noOfLines={2}>
                                            {course.description}
                                        </Text>
                                    )}

                                    <Flex wrap="wrap" gap={4} mt={4}>
                                        <HStack>
                                            <Icon as={CalendarOutlined} color="gray.500" />
                                            <Text fontSize="sm">{course.course_format} format</Text>
                                        </HStack>

                                        <HStack>
                                            <Icon as={ClockCircleOutlined} color="gray.500" />
                                            <Text fontSize="sm">
                                                {course.duration_weeks || 'N/A'} weeks
                                            </Text>
                                        </HStack>

                                        <HStack>
                                            <Icon as={TeamOutlined} color="gray.500" />
                                            <Text fontSize="sm">
                                                {course.enrolled_students || 0}/{course.max_students || '∞'} students
                                            </Text>
                                        </HStack>

                                        <HStack>
                                            <Icon as={DollarOutlined} color="gray.500" />
                                            <Text fontSize="sm">
                                                {course.price_cents > 0 ? formatPrice(course.price_cents) : 'Free'}
                                            </Text>
                                        </HStack>
                                    </Flex>
                                </Box>

                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<MoreOutlined />}
                                        variant="ghost"
                                        size="sm"
                                    />
                                    <MenuList>
                                        <MenuItem
                                            icon={<EyeOutlined />}
                                            onClick={() => handleViewCourse(course.id)}
                                        >
                                            View Details
                                        </MenuItem>
                                        <MenuItem
                                            icon={<EditOutlined />}
                                            onClick={() => handleEditCourse(course.id)}
                                        >
                                            Edit Course
                                        </MenuItem>
                                        <MenuItem
                                            icon={<TeamOutlined />}
                                            onClick={() => handleAssignTeacher(course.id)}
                                        >
                                            Assign Teacher
                                        </MenuItem>
                                        <MenuItem
                                            icon={<DeleteOutlined />}
                                            color="red.500"
                                            onClick={() => handleDeleteCourse(course.id, course.name)}
                                        >
                                            Delete Course
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Flex>
                        </CardBody>

                        <CardFooter borderTop="1px" borderColor="gray.100" pt={3}>
                            <Flex justify="space-between" w="100%">
                                <Text fontSize="sm" color="gray.500">
                                    Created: {new Date(course.created_at).toLocaleDateString()}
                                </Text>
                                <HStack spacing={2}>
                                    {!course.teacher_id && (
                                        <Badge colorScheme="orange" variant="outline">
                                            Teacher Not Assigned
                                        </Badge>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleViewCourse(course.id)}
                                    >
                                        View Details
                                    </Button>
                                </HStack>
                            </Flex>
                        </CardFooter>
                    </Card>
                ))}
            </VStack>
        </Box>
    );
};

export default CourseListView;