import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    Tag,
    Grid,
    GridItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText
} from '@chakra-ui/react';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    DollarOutlined,
    UserOutlined,
    EnvironmentOutlined,
    BookOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { getCourseById, deleteCourse } from '../../../api/course';
import './ViewCourseView.css';

const ViewCourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen: isStudentsOpen, onOpen: onStudentsOpen, onClose: onStudentsClose } = useDisclosure();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const response = await getCourseById(id);

            if (response.data) {
                setCourse(response.data);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            toast({
                title: 'Error',
                description: 'Failed to load course data',
                status: 'error',
                duration: 3000,
            });
            navigate('/dashboard/mosque-admin/courses');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/dashboard/mosque-admin/courses/edit/${id}`);
    };

    const handleAssignTeacher = () => {
        navigate(`/dashboard/mosque-admin/courses/assign-teacher/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${course.name}"? This action cannot be undone.`)) {
            try {
                setDeleting(true);
                await deleteCourse(id);
                toast({
                    title: 'Success',
                    description: 'Course deleted successfully',
                    status: 'success',
                    duration: 3000,
                });
                navigate('/dashboard/mosque-admin/courses');
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to delete course',
                    status: 'error',
                    duration: 3000,
                });
            } finally {
                setDeleting(false);
            }
        }
    };

    const formatPrice = (cents) => {
        return cents > 0 ? `$${(cents / 100).toFixed(2)}` : 'Free';
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

    if (loading) {
        return (
            <Flex justify="center" align="center" h="400px">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    if (!course) {
        return (
            <Box p={8}>
                <Alert status="error">
                    <AlertIcon />
                    <AlertDescription>Course not found</AlertDescription>
                </Alert>
            </Box>
        );
    }

    return (
        <Box className="view-course-container" p={6} maxW="1400px" mx="auto">
            {/* Header with Actions */}
            <Flex justify="space-between" align="center" mb={6}>
                <Button
                    leftIcon={<ArrowLeftOutlined />}
                    variant="ghost"
                    onClick={() => navigate('/dashboard/mosque-admin/courses')}
                    _hover={{ bg: 'gray.100', transform: 'translateX(-4px)' }}
                    transition="all 0.2s"
                >
                    Back to Courses
                </Button>

                <HStack spacing={3}>
                    <Button
                        leftIcon={<EditOutlined />}
                        colorScheme="blue"
                        onClick={handleEdit}
                    >
                        Edit Course
                    </Button>
                    <Button
                        leftIcon={<DeleteOutlined />}
                        colorScheme="red"
                        variant="outline"
                        onClick={handleDelete}
                        isLoading={deleting}
                    >
                        Delete
                    </Button>
                </HStack>
            </Flex>

            {/* Course Header Card */}
            <Card className="course-header-card" mb={6}>
                <CardBody>
                    <Flex justify="space-between" align="start">
                        <Box flex="1">
                            <HStack spacing={3} mb={3}>
                                <Heading size="lg">{course.name}</Heading>
                                <Badge colorScheme={course.is_active ? 'green' : 'red'} fontSize="md" px={3} py={1}>
                                    {course.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge colorScheme={getCourseTypeColor(course.course_type)} fontSize="md" px={3} py={1}>
                                    {course.course_type}
                                </Badge>
                                {course.target_gender && (
                                    <Badge
                                        colorScheme={course.target_gender === 'male' ? 'blue' : 'pink'}
                                        fontSize="md"
                                        px={3}
                                        py={1}
                                    >
                                        {course.target_gender === 'male' ? '♂ Male Only' : '♀ Female Only'}
                                    </Badge>
                                )}
                            </HStack>

                            {course.description && (
                                <Text color="gray.600" fontSize="lg" mb={4}>
                                    {course.description}
                                </Text>
                            )}

                            <HStack spacing={6} flexWrap="wrap">
                                <HStack>
                                    <Icon as={CalendarOutlined} color="gray.500" />
                                    <Text fontSize="sm" color="gray.600">
                                        {course.course_format === 'short' ? 'Short Course' : 'Long Course'}
                                    </Text>
                                </HStack>

                                <HStack>
                                    <Icon as={EnvironmentOutlined} color="gray.500" />
                                    <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                                        {course.schedule_type}
                                    </Text>
                                </HStack>

                                <HStack>
                                    <Icon as={DollarOutlined} color="gray.500" />
                                    <Text fontSize="sm" color="gray.600" fontWeight="600">
                                        {formatPrice(course.price_cents)}
                                    </Text>
                                </HStack>

                                {course.memorization_level && (
                                    <HStack>
                                        <Icon as={BookOutlined} color="gray.500" />
                                        <Text fontSize="sm" color="gray.600">
                                            {course.memorization_level}
                                        </Text>
                                    </HStack>
                                )}
                            </HStack>
                        </Box>
                    </Flex>
                </CardBody>
            </Card>

            <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={6} mb={6}>
                {/* Statistics Cards */}
                <GridItem>
                    <Card
                        className="stat-card-clickable"
                        cursor="pointer"
                        onClick={onStudentsOpen}
                        _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                        transition="all 0.3s"
                    >
                        <CardBody>
                            <Stat>
                                <StatLabel fontSize="sm" color="gray.600">
                                    <HStack>
                                        <Icon as={TeamOutlined} />
                                        <Text>Enrolled Students</Text>
                                    </HStack>
                                </StatLabel>
                                <StatNumber fontSize="3xl" color="blue.600">
                                    {course.enrolled_students || 0}
                                </StatNumber>
                                <StatHelpText>
                                    {course.max_students ? `/ ${course.max_students} max` : 'No limit'}
                                </StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card className="stat-card">
                        <CardBody>
                            <Stat>
                                <StatLabel fontSize="sm" color="gray.600">
                                    <HStack>
                                        <Icon as={ClockCircleOutlined} />
                                        <Text>Duration</Text>
                                    </HStack>
                                </StatLabel>
                                <StatNumber fontSize="3xl" color="purple.600">
                                    {course.duration_weeks || 'N/A'}
                                </StatNumber>
                                <StatHelpText>
                                    weeks ({course.total_sessions || 'N/A'} sessions)
                                </StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>

                <GridItem>
                    <Card className="stat-card">
                        <CardBody>
                            <Stat>
                                <StatLabel fontSize="sm" color="gray.600">
                                    <HStack>
                                        <Icon as={CalendarOutlined} />
                                        <Text>Created</Text>
                                    </HStack>
                                </StatLabel>
                                <StatNumber fontSize="xl" color="gray.700">
                                    {new Date(course.created_at).toLocaleDateString()}
                                </StatNumber>
                                <StatHelpText>
                                    by {course.created_by_name || 'Admin'}
                                </StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>

            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                {/* Teacher Information Card */}
                <GridItem>
                    <Card>
                        <CardHeader>
                            <Heading size="md">
                                <Icon as={UserOutlined} mr={2} />
                                Assigned Teacher
                            </Heading>
                        </CardHeader>
                        <CardBody>
                            {course.teacher_id ? (
                                <VStack align="start" spacing={4}>
                                    <HStack>
                                        <Avatar name={course.teacher_name} size="lg" />
                                        <Box>
                                            <Text fontWeight="600" fontSize="lg">
                                                {course.teacher_name}
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                {course.teacher_email}
                                            </Text>
                                        </Box>
                                    </HStack>

                                    {course.teacher_phone && (
                                        <HStack>
                                            <Text fontWeight="600">Phone:</Text>
                                            <Text color="gray.600">{course.teacher_phone}</Text>
                                        </HStack>
                                    )}

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        colorScheme="blue"
                                        onClick={handleAssignTeacher}
                                    >
                                        Change Teacher
                                    </Button>
                                </VStack>
                            ) : (
                                <VStack spacing={4} py={4}>
                                    <Alert status="warning">
                                        <AlertIcon />
                                        <AlertDescription>
                                            No teacher assigned to this course yet
                                        </AlertDescription>
                                    </Alert>
                                    <Button
                                        colorScheme="blue"
                                        onClick={handleAssignTeacher}
                                        leftIcon={<TeamOutlined />}
                                    >
                                        Assign Teacher
                                    </Button>
                                </VStack>
                            )}
                        </CardBody>
                    </Card>
                </GridItem>

                {/* Class Schedule Card */}
                <GridItem>
                    <Card>
                        <CardHeader>
                            <Heading size="md">
                                <Icon as={CalendarOutlined} mr={2} />
                                Class Schedule
                            </Heading>
                        </CardHeader>
                        <CardBody>
                            {course.schedule && course.schedule.length > 0 ? (
                                <VStack spacing={3} align="stretch">
                                    {course.schedule.map((slot, idx) => (
                                        <Flex
                                            key={idx}
                                            p={3}
                                            bg="gray.50"
                                            borderRadius="md"
                                            justify="space-between"
                                            align="center"
                                        >
                                            <HStack>
                                                <Icon as={ClockCircleOutlined} color="blue.500" />
                                                <Text fontWeight="600" textTransform="capitalize">
                                                    {slot.day_of_week}
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="blue.600">
                                                {slot.start_time} - {slot.end_time}
                                            </Text>
                                        </Flex>
                                    ))}
                                </VStack>
                            ) : (
                                <Alert status="info">
                                    <AlertIcon />
                                    <AlertDescription>
                                        No schedule set for this course
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>

            {/* Students Modal */}
            <Modal isOpen={isStudentsOpen} onClose={onStudentsClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Enrolled Students</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {course.enrolled_students > 0 ? (
                            <Box>
                                <Text mb={4} color="gray.600">
                                    {course.enrolled_students} student(s) enrolled in this course
                                </Text>
                                <Alert status="info" mb={4}>
                                    <AlertIcon />
                                    <AlertDescription>
                                        Student enrollment details will be available in the next update
                                    </AlertDescription>
                                </Alert>
                                {/* Placeholder for future student list */}
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Name</Th>
                                            <Th>Status</Th>
                                            <Th>Progress</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td colSpan={3} textAlign="center" color="gray.500">
                                                Student details coming soon...
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : (
                            <Alert status="warning">
                                <AlertIcon />
                                <AlertDescription>
                                    No students enrolled in this course yet
                                </AlertDescription>
                            </Alert>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ViewCourseView;