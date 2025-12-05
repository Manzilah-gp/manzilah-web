import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Heading,
    useToast,
    Card,
    CardBody,
    VStack,
    HStack,
    Text,
    Spinner,
    Flex,
    Badge,
    Divider,
    Alert,
    AlertIcon,
    AlertDescription
} from '@chakra-ui/react';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import {
    getCourseById,
    getSuggestedTeachers,
    assignTeacherToCourse
} from '../../../api/course';
import TeacherSelectionModal from '../../../components/Course/TeacherSelectionModal';

const AssignTeacherView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [course, setCourse] = useState(null);
    const [suggestedTeachers, setSuggestedTeachers] = useState([]);
    const [showTeacherModal, setShowTeacherModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch course details
            const courseRes = await getCourseById(id);

            if (courseRes.data.success) {
                const courseData = courseRes.data.data;
                setCourse(courseData);

                // Prepare suggestion criteria
                const suggestionData = {
                    course_type_id: courseData.course_type_id,
                    course_level: courseData.course_level,
                    schedule: courseData.schedule,
                    mosque_id: courseData.mosque_id,
                    target_gender: courseData.target_gender
                };

                // Fetch teacher suggestions
                const teachersRes = await getSuggestedTeachers(suggestionData);

                if (teachersRes.data.success) {
                    setSuggestedTeachers(teachersRes.data.data);
                }
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load course data',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTeacher = async (teacher) => {
        try {
            setAssigning(true);

            const response = await assignTeacherToCourse(id, teacher.id);

            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: `${teacher.full_name} has been assigned to this course`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Navigate back to course list
                navigate('/dashboard/mosque-admin/courses');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to assign teacher',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setAssigning(false);
            setShowTeacherModal(false);
        }
    };

    if (loading || !course) {
        return (
            <Flex justify="center" align="center" h="400px">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <Box p={6} maxW="1200px" mx="auto">
            <Button
                leftIcon={<ArrowLeftOutlined />}
                variant="ghost"
                mb={4}
                onClick={() => navigate('/dashboard/mosque-admin/courses')}
            >
                Back to Courses
            </Button>

            <VStack spacing={6} align="stretch">
                <Box>
                    <Heading size="lg" mb={2}>Assign Teacher</Heading>
                    <Text color="gray.600">
                        Select a qualified teacher for this course
                    </Text>
                </Box>

                {/* Course Information Card */}
                <Card>
                    <CardBody>
                        <Heading size="md" mb={4}>Course Information</Heading>

                        <VStack spacing={3} align="stretch">
                            <HStack justify="space-between">
                                <Text fontWeight="600">Course Name:</Text>
                                <Text>{course.name}</Text>
                            </HStack>

                            <HStack justify="space-between">
                                <Text fontWeight="600">Course Type:</Text>
                                <Badge colorScheme="blue">{course.course_type}</Badge>
                            </HStack>

                            {course.memorization_level && (
                                <HStack justify="space-between">
                                    <Text fontWeight="600">Level:</Text>
                                    <Text>{course.memorization_level}</Text>
                                </HStack>
                            )}

                            <HStack justify="space-between">
                                <Text fontWeight="600">Format:</Text>
                                <Badge colorScheme={course.course_format === 'short' ? 'blue' : 'purple'}>
                                    {course.course_format === 'short' ? 'Short Course' : 'Long Course'}
                                </Badge>
                            </HStack>

                            <HStack justify="space-between">
                                <Text fontWeight="600">Delivery:</Text>
                                <Badge colorScheme={
                                    course.schedule_type === 'online' ? 'green' :
                                        course.schedule_type === 'onsite' ? 'orange' : 'teal'
                                }>
                                    {course.schedule_type}
                                </Badge>
                            </HStack>

                            {course.target_gender && (
                                <HStack justify="space-between">
                                    <Text fontWeight="600">Target Gender:</Text>
                                    <Badge colorScheme={
                                        course.target_gender === 'male' ? 'blue' : 'pink'
                                    }>
                                        {course.target_gender === 'male' ? 'Male Only' : 'Female Only'}
                                    </Badge>
                                </HStack>
                            )}

                            {course.schedule && course.schedule.length > 0 && (
                                <>
                                    <Divider />
                                    <Box>
                                        <Text fontWeight="600" mb={2}>Class Schedule:</Text>
                                        <VStack spacing={2} align="stretch">
                                            {course.schedule.map((slot, idx) => (
                                                <Flex
                                                    key={idx}
                                                    p={2}
                                                    bg="gray.50"
                                                    borderRadius="md"
                                                    justify="space-between"
                                                >
                                                    <Text textTransform="capitalize">{slot.day_of_week}</Text>
                                                    <Text fontWeight="600">
                                                        {slot.start_time} - {slot.end_time}
                                                    </Text>
                                                </Flex>
                                            ))}
                                        </VStack>
                                    </Box>
                                </>
                            )}
                        </VStack>
                    </CardBody>
                </Card>

                {/* Teacher Suggestions Summary */}
                <Card>
                    <CardBody>
                        <Heading size="md" mb={4}>Available Teachers</Heading>

                        {suggestedTeachers.length === 0 ? (
                            <Alert status="warning">
                                <AlertIcon />
                                <AlertDescription>
                                    No teachers found matching all course requirements.
                                    You may need to adjust course parameters or wait for more teachers to register.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <>
                                <Text mb={4} color="gray.600">
                                    Found {suggestedTeachers.length} qualified teacher(s) based on:
                                </Text>

                                <VStack spacing={2} align="stretch" mb={4}>
                                    <HStack>
                                        <Badge>✓</Badge>
                                        <Text fontSize="sm">Course type expertise</Text>
                                    </HStack>
                                    {course.course_level && (
                                        <HStack>
                                            <Badge>✓</Badge>
                                            <Text fontSize="sm">Memorization level capability</Text>
                                        </HStack>
                                    )}
                                    {course.target_gender && (
                                        <HStack>
                                            <Badge>✓</Badge>
                                            <Text fontSize="sm">Gender matching</Text>
                                        </HStack>
                                    )}
                                    {course.schedule && course.schedule.length > 0 && (
                                        <HStack>
                                            <Badge>✓</Badge>
                                            <Text fontSize="sm">Schedule availability</Text>
                                        </HStack>
                                    )}
                                    <HStack>
                                        <Badge>✓</Badge>
                                        <Text fontSize="sm">Current workload</Text>
                                    </HStack>
                                </VStack>

                                <HStack spacing={3}>
                                    <Button
                                        colorScheme="blue"
                                        size="lg"
                                        onClick={() => setShowTeacherModal(true)}
                                        isLoading={assigning}
                                    >
                                        View & Select Teacher
                                    </Button>

                                    <Button
                                        variant="outline"
                                        leftIcon={<ReloadOutlined />}
                                        onClick={fetchData}
                                    >
                                        Refresh Suggestions
                                    </Button>
                                </HStack>
                            </>
                        )}
                    </CardBody>
                </Card>

                {/* Alternative Options */}
                <Card bg="gray.50">
                    <CardBody>
                        <Heading size="sm" mb={2}>Alternative Options</Heading>
                        <Text fontSize="sm" color="gray.600" mb={3}>
                            If you can't find a suitable teacher right now:
                        </Text>
                        <VStack spacing={2} align="stretch">
                            <Text fontSize="sm">
                                • You can leave the course without a teacher and assign one later
                            </Text>
                            <Text fontSize="sm">
                                • Consider adjusting the course schedule to match teacher availability
                            </Text>
                            <Text fontSize="sm">
                                • Check back as new teachers complete their registration
                            </Text>
                        </VStack>

                        <Button
                            mt={4}
                            size="sm"
                            variant="outline"
                            onClick={() => navigate('/dashboard/mosque-admin/courses')}
                        >
                            Assign Teacher Later
                        </Button>
                    </CardBody>
                </Card>
            </VStack>

            {/* Teacher Selection Modal */}
            <TeacherSelectionModal
                isOpen={showTeacherModal}
                onClose={() => setShowTeacherModal(false)}
                teachers={suggestedTeachers}
                onSelect={handleAssignTeacher}
                courseData={course}
            />
        </Box>
    );
};

export default AssignTeacherView;