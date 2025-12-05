import React, { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Button,
    VStack,
    HStack,
    Box,
    Text,
    Badge,
    Avatar,
    Progress,
    Flex,
    Tag,
    TagLabel,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Tooltip,
    Icon,
    Alert,
    AlertIcon,
    AlertDescription,
    useToast,
} from "@chakra-ui/react";

import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    TrophyOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    StarFilled,
} from "@ant-design/icons";


const TeacherSelectionModal = ({ isOpen, onClose, teachers, onSelect, courseData }) => {
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const toast = useToast();

    const getRecommendationColor = (level) => {
        switch (level) {
            case 'highly_recommended':
                return 'green';
            case 'recommended':
                return 'blue';
            case 'suitable':
                return 'orange';
            default:
                return 'gray';
        }
    };

    const getRecommendationText = (level) => {
        switch (level) {
            case 'highly_recommended':
                return 'Highly Recommended';
            case 'recommended':
                return 'Recommended';
            case 'suitable':
                return 'Suitable';
            default:
                return 'Not Recommended';
        }
    };

    const handleSelect = () => {
        if (!selectedTeacher) {
            toast({
                title: 'No Selection',
                description: 'Please select a teacher',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        onSelect(selectedTeacher);
    };

    const MatchIndicator = ({ matched, label }) => (
        <HStack spacing={2}>
            {matched === true ? (
                <>
                    <Icon as={CheckCircleOutlined} color="green.500" />
                    <Text fontSize="sm" color="green.600">{label}</Text>
                </>
            ) : matched === 'partial' ? (
                <>
                    <Icon as={ClockCircleOutlined} color="orange.500" />
                    <Text fontSize="sm" color="orange.600">{label} (Partial)</Text>
                </>
            ) : (
                <>
                    <Icon as={CloseCircleOutlined} color="red.500" />
                    <Text fontSize="sm" color="red.600">{label}</Text>
                </>
            )}
        </HStack>
    );

    if (!teachers || teachers.length === 0) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>No Teachers Available</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Alert status="info">
                            <AlertIcon />
                            <AlertDescription>
                                No teachers match the course requirements. You can still create the course
                                and assign a teacher manually later.
                            </AlertDescription>
                        </Alert>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent maxH="90vh">
                <ModalHeader>
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">Suggested Teachers</Text>
                            <Text fontSize="sm" fontWeight="normal" color="gray.600">
                                {teachers.length} teachers found based on course requirements
                            </Text>
                        </Box>
                        {selectedTeacher && (
                            <Badge colorScheme="blue" fontSize="md" p={2}>
                                Selected: {selectedTeacher.full_name}
                            </Badge>
                        )}
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {teachers.map((teacher) => (
                            <Box
                                key={teacher.id}
                                p={5}
                                borderWidth="2px"
                                borderRadius="lg"
                                borderColor={
                                    selectedTeacher?.id === teacher.id
                                        ? 'blue.500'
                                        : 'gray.200'
                                }
                                cursor="pointer"
                                onClick={() => setSelectedTeacher(teacher)}
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: 'blue.300',
                                    shadow: 'md'
                                }}
                            >
                                <Flex gap={4}>
                                    {/* Left: Avatar and Basic Info */}
                                    <Box>
                                        <Avatar
                                            size="xl"
                                            name={teacher.full_name}
                                            bg={getRecommendationColor(teacher.recommendation_level) + '.500'}
                                        />
                                    </Box>

                                    {/* Middle: Details */}
                                    <Box flex="1">
                                        <Flex justify="space-between" align="start" mb={2}>
                                            <Box>
                                                <HStack spacing={2} mb={1}>
                                                    <Text fontSize="lg" fontWeight="bold">
                                                        {teacher.full_name}
                                                    </Text>
                                                    <Badge
                                                        colorScheme={getRecommendationColor(teacher.recommendation_level)}
                                                    >
                                                        {getRecommendationText(teacher.recommendation_level)}
                                                    </Badge>
                                                </HStack>
                                                <HStack spacing={2} color="gray.600">
                                                    <Text fontSize="sm">{teacher.email}</Text>
                                                    {teacher.phone && (
                                                        <>
                                                            <Text>•</Text>
                                                            <Text fontSize="sm">{teacher.phone}</Text>
                                                        </>
                                                    )}
                                                </HStack>
                                            </Box>

                                            {/* Match Score */}
                                            <Tooltip label="Match Score based on multiple criteria">
                                                <Box textAlign="center">
                                                    <Flex align="center" gap={1}>
                                                        <Icon as={StarFilled} color="yellow.400" />
                                                        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                                                            {teacher.match_score}
                                                        </Text>
                                                    </Flex>
                                                    <Text fontSize="xs" color="gray.500">Match Score</Text>
                                                </Box>
                                            </Tooltip>
                                        </Flex>

                                        {/* Match Indicators */}
                                        <Flex wrap="wrap" gap={3} mb={3}>
                                            {teacher.match_details.expertise_match && (
                                                <MatchIndicator matched={true} label="Expertise Match" />
                                            )}
                                            {teacher.match_details.level_match !== undefined && (
                                                <MatchIndicator
                                                    matched={teacher.match_details.level_match}
                                                    label="Level Qualified"
                                                />
                                            )}
                                            {teacher.match_details.gender_match !== undefined && (
                                                <MatchIndicator
                                                    matched={teacher.match_details.gender_match}
                                                    label="Gender Match"
                                                />
                                            )}
                                            {teacher.match_details.schedule_match !== undefined && (
                                                <MatchIndicator
                                                    matched={teacher.match_details.schedule_match}
                                                    label="Schedule Available"
                                                />
                                            )}
                                            {teacher.match_details.mosque_preference_match && (
                                                <MatchIndicator matched={true} label="Mosque Preference" />
                                            )}
                                        </Flex>

                                        {/* Quick Stats */}
                                        <HStack spacing={6} mb={3}>
                                            <Tooltip label="Total experience">
                                                <HStack>
                                                    <Icon as={TrophyOutlined} />
                                                    <Text fontSize="sm">
                                                        {teacher.expertise_years} years
                                                    </Text>
                                                </HStack>
                                            </Tooltip>

                                            <Tooltip label="Active courses">
                                                <HStack>
                                                    <Icon as={TeamOutlined} />
                                                    <Text fontSize="sm">
                                                        {teacher.active_courses_count} courses
                                                    </Text>
                                                    <Badge colorScheme={
                                                        teacher.match_details.workload_status === 'available' ? 'green' :
                                                            teacher.match_details.workload_status === 'light' ? 'blue' :
                                                                teacher.match_details.workload_status === 'moderate' ? 'orange' : 'red'
                                                    }>
                                                        {teacher.match_details.workload_status}
                                                    </Badge>
                                                </HStack>
                                            </Tooltip>

                                            {teacher.hourly_rate_cents > 0 && (
                                                <Text fontSize="sm" fontWeight="600">
                                                    ${(teacher.hourly_rate_cents / 100).toFixed(2)}/hr
                                                </Text>
                                            )}
                                        </HStack>

                                        {/* Certifications */}
                                        <HStack spacing={2}>
                                            {teacher.has_tajweed_certificate && (
                                                <Badge colorScheme="green">Tajweed Certified</Badge>
                                            )}
                                            {teacher.has_sharea_certificate && (
                                                <Badge colorScheme="purple">Sharea Certified</Badge>
                                            )}
                                            {teacher.max_level_name && (
                                                <Badge colorScheme="blue">{teacher.max_level_name}</Badge>
                                            )}
                                        </HStack>

                                        {/* Expandable Details */}
                                        <Accordion allowToggle mt={3}>
                                            <AccordionItem border="none">
                                                <AccordionButton px={0}>
                                                    <Box flex="1" textAlign="left">
                                                        <Text fontSize="sm" fontWeight="600" color="blue.600">
                                                            View Detailed Information
                                                        </Text>
                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                                <AccordionPanel px={0}>
                                                    <VStack spacing={3} align="stretch">
                                                        {/* Availability */}
                                                        {teacher.availability && teacher.availability.length > 0 && (
                                                            <Box>
                                                                <Text fontWeight="600" mb={2} fontSize="sm">
                                                                    <Icon as={ClockCircleOutlined} mr={2} />
                                                                    Weekly Availability
                                                                </Text>
                                                                <Flex wrap="wrap" gap={2}>
                                                                    {teacher.availability.map((slot, idx) => (
                                                                        <Tag key={idx} size="sm" colorScheme="blue">
                                                                            <TagLabel>
                                                                                {slot.day_of_week}: {slot.start_time} - {slot.end_time}
                                                                            </TagLabel>
                                                                        </Tag>
                                                                    ))}
                                                                </Flex>
                                                            </Box>
                                                        )}

                                                        {/* Mosque Preferences */}
                                                        {teacher.mosque_preferences && teacher.mosque_preferences.length > 0 && (
                                                            <Box>
                                                                <Text fontWeight="600" mb={2} fontSize="sm">
                                                                    <Icon as={EnvironmentOutlined} mr={2} />
                                                                    Preferred Mosques
                                                                </Text>
                                                                <Flex wrap="wrap" gap={2}>
                                                                    {teacher.mosque_preferences.map((mosque) => (
                                                                        <Tag key={mosque.id} size="sm" colorScheme="green">
                                                                            <TagLabel>
                                                                                {mosque.name} ({mosque.governorate})
                                                                            </TagLabel>
                                                                        </Tag>
                                                                    ))}
                                                                </Flex>
                                                            </Box>
                                                        )}

                                                        {/* Current Courses */}
                                                        {teacher.current_courses && teacher.current_courses.length > 0 && (
                                                            <Box>
                                                                <Text fontWeight="600" mb={2} fontSize="sm">
                                                                    <Icon as={TeamOutlined} mr={2} />
                                                                    Currently Teaching
                                                                </Text>
                                                                <VStack spacing={1} align="stretch">
                                                                    {teacher.current_courses.map((course) => (
                                                                        <Text key={course.id} fontSize="sm" color="gray.600">
                                                                            • {course.name} at {course.mosque_name} ({course.student_count} students)
                                                                        </Text>
                                                                    ))}
                                                                </VStack>
                                                            </Box>
                                                        )}
                                                    </VStack>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        </Accordion>
                                    </Box>
                                </Flex>

                                {/* Match Progress Bar */}
                                <Box mt={3}>
                                    <Flex justify="space-between" mb={1}>
                                        <Text fontSize="xs" color="gray.600">Overall Match</Text>
                                        <Text fontSize="xs" fontWeight="600">{teacher.match_score}/100</Text>
                                    </Flex>
                                    <Progress
                                        value={teacher.match_score}
                                        size="sm"
                                        colorScheme={getRecommendationColor(teacher.recommendation_level)}
                                        borderRadius="full"
                                    />
                                </Box>
                            </Box>
                        ))}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handleSelect}
                        isDisabled={!selectedTeacher}
                    >
                        Select Teacher
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TeacherSelectionModal;