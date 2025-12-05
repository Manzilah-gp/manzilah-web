// src/pages/MosqueAdminDashboard/CreateCourse/CreateCourseView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    VStack,
    HStack,
    Heading,
    useToast,
    Card,
    CardBody,
    NumberInput,
    NumberInputField,
    Switch,
    Flex,
    Text,
    Tag,
    IconButton,
    Divider,
    Radio,
    RadioGroup,
    Stack
} from '@chakra-ui/react';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    getCourseTypes,
    getMemorizationLevels,
    createCourse,
    getSuggestedTeachers
} from '../../../api/course';
import TeacherSelectionModal from '../../../components/Course/TeacherSelectionModal';

const CreateCourseView = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [courseTypes, setCourseTypes] = useState([]);
    const [memorizationLevels, setMemorizationLevels] = useState([]);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [suggestedTeachers, setSuggestedTeachers] = useState([]);

    // Get mosque_id from user context
    const mosqueId = localStorage.getItem('user_mosque_id') || 1;

    // Form state
    const [formData, setFormData] = useState({
        mosque_id: mosqueId,
        course_type_id: '',
        name: '',
        description: '',
        course_format: 'short',
        difficulty_level: 1,
        price_cents: 0,
        duration_weeks: null,
        total_sessions: null,
        max_students: null,
        schedule_type: 'onsite',
        target_age_group: [],
        target_gender: '', // 'male', 'female', or '' for mixed
        course_level: null,
        is_active: true,
        schedule: []
    });

    const [scheduleEntry, setScheduleEntry] = useState({
        day_of_week: 'sunday',
        start_time: '',
        end_time: '',
        location: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [typesRes, levelsRes] = await Promise.all([
                getCourseTypes(),
                getMemorizationLevels()
            ]);

            if (typesRes.data.success) {
                setCourseTypes(typesRes.data.data);
            }

            if (levelsRes.data.success) {
                setMemorizationLevels(levelsRes.data.data);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load initial data',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addScheduleEntry = () => {
        if (!scheduleEntry.start_time || !scheduleEntry.end_time) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in start and end time',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        setFormData(prev => ({
            ...prev,
            schedule: [...prev.schedule, { ...scheduleEntry }]
        }));

        // Reset entry
        setScheduleEntry({
            day_of_week: 'sunday',
            start_time: '',
            end_time: '',
            location: ''
        });
    };

    const removeScheduleEntry = (index) => {
        setFormData(prev => ({
            ...prev,
            schedule: prev.schedule.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.course_type_id) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all required fields',
                status: 'warning',
                duration: 3000,
            });
            return;
        }

        try {
            setLoading(true);

            const response = await createCourse(formData);

            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: 'Course created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Navigate to course list or show teacher assignment
                navigate('/dashboard/mosque-admin/courses');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create course',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGetTeacherSuggestions = async () => {
        if (!formData.course_type_id) {
            toast({
                title: 'Validation Error',
                description: 'Please select a course type first',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        try {
            setLoading(true);

            const suggestionData = {
                course_type_id: formData.course_type_id,
                course_level: formData.course_level,
                schedule: formData.schedule,
                mosque_id: formData.mosque_id,
                target_gender: formData.target_gender
            };

            const response = await getSuggestedTeachers(suggestionData);

            if (response.data.success) {
                setSuggestedTeachers(response.data.data);
                setShowTeacherModal(true);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to get teacher suggestions',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const selectedCourseType = courseTypes.find(t => t.id === Number(formData.course_type_id));
    const isMemorizationType = selectedCourseType?.name === 'memorization';

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


            <Heading size="lg" mb={6}>Create New Course</Heading>

            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                    {/* Basic Information Card */}
                    <Card>
                        <CardBody>
                            <Heading size="md" mb={4}>Basic Information</Heading>

                            <VStack spacing={4} align="stretch">
                                <FormControl isRequired>
                                    <FormLabel>Course Name</FormLabel>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="e.g., Tajweed for Beginners"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Course Type</FormLabel>
                                    <Select
                                        value={formData.course_type_id}
                                        onChange={(e) => handleInputChange('course_type_id', e.target.value)}
                                        placeholder="Select course type"
                                    >
                                        {courseTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name} - {type.description}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>

                                {isMemorizationType && (
                                    <FormControl>
                                        <FormLabel>Memorization Level</FormLabel>
                                        <Select
                                            value={formData.course_level || ''}
                                            onChange={(e) => handleInputChange('course_level', e.target.value)}
                                            placeholder="Select level"
                                        >
                                            {memorizationLevels.map(level => (
                                                <option key={level.id} value={level.id}>
                                                    {level.level_name} (Juz {level.juz_range_start}-{level.juz_range_end})
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}

                                <FormControl>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Course description..."
                                        rows={4}
                                    />
                                </FormControl>

                                <HStack spacing={4}>
                                    <FormControl>
                                        <FormLabel>Course Format</FormLabel>
                                        <Select
                                            value={formData.course_format}
                                            onChange={(e) => handleInputChange('course_format', e.target.value)}
                                        >
                                            <option value="short">Short Course</option>
                                            <option value="long">Long Course</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Delivery Method</FormLabel>
                                        <Select
                                            value={formData.schedule_type}
                                            onChange={(e) => handleInputChange('schedule_type', e.target.value)}
                                        >
                                            <option value="onsite">On-site</option>
                                            <option value="online">Online</option>
                                            <option value="hybrid">Hybrid</option>
                                        </Select>
                                    </FormControl>
                                </HStack>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Course Details Card */}
                    <Card>
                        <CardBody>
                            <Heading size="md" mb={4}>Course Details</Heading>

                            <VStack spacing={4} align="stretch">
                                <HStack spacing={4}>
                                    <FormControl>
                                        <FormLabel>Duration (weeks)</FormLabel>
                                        <NumberInput
                                            value={formData.duration_weeks || ''}
                                            onChange={(value) => handleInputChange('duration_weeks', value)}
                                        >
                                            <NumberInputField placeholder="e.g., 12" />
                                        </NumberInput>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Total Sessions</FormLabel>
                                        <NumberInput
                                            value={formData.total_sessions || ''}
                                            onChange={(value) => handleInputChange('total_sessions', value)}
                                        >
                                            <NumberInputField placeholder="e.g., 24" />
                                        </NumberInput>
                                    </FormControl>
                                </HStack>

                                <HStack spacing={4}>
                                    <FormControl>
                                        <FormLabel>Max Students</FormLabel>
                                        <NumberInput
                                            value={formData.max_students || ''}
                                            onChange={(value) => handleInputChange('max_students', value)}
                                        >
                                            <NumberInputField placeholder="e.g., 20" />
                                        </NumberInput>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Price (USD)</FormLabel>
                                        <NumberInput
                                            value={formData.price_cents / 100 || ''}
                                            onChange={(value) => handleInputChange('price_cents', value * 100)}
                                            precision={2}
                                            step={0.01}
                                        >
                                            <NumberInputField placeholder="0.00" />
                                        </NumberInput>
                                    </FormControl>
                                </HStack>

                                <FormControl>
                                    <FormLabel>Target Gender (Important for teacher matching)</FormLabel>
                                    <RadioGroup
                                        value={formData.target_gender}
                                        onChange={(value) => handleInputChange('target_gender', value)}
                                    >
                                        <Stack direction="row" spacing={4}>
                                            <Radio value="">Mixed (No Restriction)</Radio>
                                            <Radio value="male">Male Only</Radio>
                                            <Radio value="female">Female Only</Radio>
                                        </Stack>
                                    </RadioGroup>
                                    <Text fontSize="sm" color="gray.600" mt={1}>
                                        This affects teacher suggestions based on gender matching
                                    </Text>
                                </FormControl>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Schedule Card */}
                    <Card>
                        <CardBody>
                            <Heading size="md" mb={4}>Class Schedule</Heading>

                            <VStack spacing={4} align="stretch">
                                <HStack spacing={3}>
                                    <FormControl>
                                        <FormLabel>Day</FormLabel>
                                        <Select
                                            value={scheduleEntry.day_of_week}
                                            onChange={(e) => setScheduleEntry(prev => ({
                                                ...prev,
                                                day_of_week: e.target.value
                                            }))}
                                        >
                                            <option value="sunday">Sunday</option>
                                            <option value="monday">Monday</option>
                                            <option value="tuesday">Tuesday</option>
                                            <option value="wednesday">Wednesday</option>
                                            <option value="thursday">Thursday</option>
                                            <option value="friday">Friday</option>
                                            <option value="saturday">Saturday</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Start Time</FormLabel>
                                        <Input
                                            type="time"
                                            value={scheduleEntry.start_time}
                                            onChange={(e) => setScheduleEntry(prev => ({
                                                ...prev,
                                                start_time: e.target.value
                                            }))}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>End Time</FormLabel>
                                        <Input
                                            type="time"
                                            value={scheduleEntry.end_time}
                                            onChange={(e) => setScheduleEntry(prev => ({
                                                ...prev,
                                                end_time: e.target.value
                                            }))}
                                        />
                                    </FormControl>

                                    <Box pt={8}>
                                        <IconButton
                                            icon={<PlusOutlined />}
                                            colorScheme="blue"
                                            onClick={addScheduleEntry}
                                        />
                                    </Box>
                                </HStack>

                                {formData.schedule.length > 0 && (
                                    <>
                                        <Divider />
                                        <VStack spacing={2} align="stretch">
                                            {formData.schedule.map((entry, index) => (
                                                <Flex
                                                    key={index}
                                                    justify="space-between"
                                                    align="center"
                                                    p={3}
                                                    bg="gray.50"
                                                    borderRadius="md"
                                                >
                                                    <HStack spacing={4}>
                                                        <Tag colorScheme="blue">{entry.day_of_week}</Tag>
                                                        <Text>
                                                            {entry.start_time} - {entry.end_time}
                                                        </Text>
                                                    </HStack>
                                                    <IconButton
                                                        icon={<DeleteOutlined />}
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="red"
                                                        onClick={() => removeScheduleEntry(index)}
                                                    />
                                                </Flex>
                                            ))}
                                        </VStack>
                                    </>
                                )}
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Actions */}
                    <HStack spacing={4} justify="space-between">
                        <FormControl display="flex" alignItems="center">
                            <FormLabel mb="0">Active Course</FormLabel>
                            <Switch
                                isChecked={formData.is_active}
                                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                            />
                        </FormControl>

                        <HStack>
                            <Button
                                variant="outline"
                                onClick={handleGetTeacherSuggestions}
                                isLoading={loading}
                            >
                                Preview Teacher Suggestions
                            </Button>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                isLoading={loading}
                                loadingText="Creating..."
                            >
                                Create Course
                            </Button>
                        </HStack>
                    </HStack>
                </VStack>
            </form>

            {/* Teacher Selection Modal */}
            <TeacherSelectionModal
                isOpen={showTeacherModal}
                onClose={() => setShowTeacherModal(false)}
                teachers={suggestedTeachers}
                onSelect={(teacher) => {
                    console.log('Selected teacher:', teacher);
                    setShowTeacherModal(false);
                }}
                courseData={formData}
            />
        </Box>
    );
};

export default CreateCourseView;