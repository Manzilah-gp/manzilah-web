// src/components/TeacherRegistration/MosquePreferencesForm.jsx
import React, { useEffect, useState } from 'react';
import { Form, Select, Checkbox, InputNumber, TimePicker, Row, Col, Card, Tag, Divider, Spin } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, ReadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getAllMosques } from '../../api/mosque';

const { Option } = Select;
const { RangePicker } = TimePicker;

const MosquePreferencesForm = ({ formData, updateFormData }) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [mosques, setMosques] = useState([]);
    const [loadingMosques, setLoadingMosques] = useState(false);

    // Fetch mosques on component mount
    useEffect(() => {
        const fetchMosques = async () => {
            setLoadingMosques(true);
            try {
                const response = await getAllMosques();
                console.log('📍 Mosques API Response:', response);

                // ✅ Handle different response structures
                const mosquesData = response.data?.data || response.data || [];

                // ✅ Ensure it's an array
                if (Array.isArray(mosquesData)) {
                    setMosques(mosquesData);
                    console.log('✅ Mosques loaded:', mosquesData.length);
                } else {
                    console.error('❌ Mosques data is not an array:', mosquesData);
                    setMosques([]);
                    message.error('Failed to load mosques. Invalid data format.');
                }
            } catch (error) {
                console.error('❌ Error fetching mosques:', error);
                message.error('Failed to load mosques. Please try again.');
                setMosques([]);
            } finally {
                setLoadingMosques(false);
            }
        };

        fetchMosques();
    }, []);

    const onValuesChange = (changedValues, allValues) => {
        console.log('Form values changed:', allValues);
        updateFormData(allValues);
    };

    const courseTypes = [
        { value: 1, label: t('course.memorization') || 'حفظ القرآن', levels: 6 },
        { value: 2, label: t('course.tajweed') || 'التجويد', levels: 4 },
        { value: 3, label: t('course.feqh') || 'الفقه', levels: 3 }
    ];

    const memorizationLevels = [
        { level: 1, juz: t('juz.juz1'), description: t('level.level1') },
        { level: 2, juz: t('juz.juz2'), description: t('level.level2') },
        { level: 3, juz: t('juz.juz3'), description: t('level.level3') },
        { level: 4, juz: t('juz.juz4'), description: t('level.level4') },
        { level: 5, juz: t('juz.juz5'), description: t('level.level5') },
        { level: 6, juz: t('juz.juz6'), description: t('level.level6') }
    ];

    const agePreferences = [
        { value: 'children', label: t('age.children') || 'أطفال (5-12)' },
        { value: 'teens', label: t('age.teens') || 'مراهقين (13-17)' },
        { value: 'adults', label: t('age.adults') || 'بالغين (18+)' },
        { value: 'all', label: t('age.all') || 'جميع الأعمار' }
    ];

    const daysOfWeek = [
        { value: 'sunday', label: t('day.sunday') || 'الأحد' },
        { value: 'monday', label: t('day.monday') || 'الإثنين' },
        { value: 'tuesday', label: t('day.tuesday') || 'الثلاثاء' },
        { value: 'wednesday', label: t('day.wednesday') || 'الأربعاء' },
        { value: 'thursday', label: t('day.thursday') || 'الخميس' },
        { value: 'friday', label: t('day.friday') || 'الجمعة' },
        { value: 'saturday', label: t('day.saturday') || 'السبت' }
    ];

    const teachingFormats = [
        { value: 'online', label: t('format.online') || 'أونلاين' },
        { value: 'onsite', label: t('format.onsite') || 'حضوري' },
        { value: 'hybrid', label: t('format.hybrid') || 'مختلط' }
    ];

    return (
        <div className="form-container">
            <Form
                form={form}
                layout="vertical"
                initialValues={formData}
                onValuesChange={onValuesChange}
                size="large"
            >
                {/* Expertise Section */}
                <Card className="form-section-card">
                    <div className="form-section">
                        <h3>
                            <ReadOutlined style={{ marginLeft: 8 }} />
                            {t('teacher.preferences') || 'التخصصات والتفضيلات'}
                        </h3>

                        <Form.Item
                            name="course_expertise"
                            label={t('teacher.courseExpertise')}
                            rules={[{ required: true, message: t('teacher.selectAtLeastOne') }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder={t('teacher.courseExpertise')}
                                optionLabelProp="label"
                            >
                                {courseTypes.map(course => (
                                    <Option key={course.value} value={course.value} label={course.label}>
                                        <div>
                                            <strong>{course.label}</strong>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item shouldUpdate>
                            {({ getFieldValue }) => {
                                const selectedCourses = getFieldValue('course_expertise') || [];
                                const memorizationSelected = selectedCourses.includes(1);

                                if (!memorizationSelected) return null;

                                return (
                                    <Form.Item
                                        name="max_level_qualified"
                                        label={t('teacher.selectMaxLevel')}
                                        rules={[{ required: true, message: t('teacher.selectMaxLevel') }]}
                                    >
                                        <Select placeholder={t('teacher.maxLevel')}>
                                            {memorizationLevels.map(level => (
                                                <Option key={level.level} value={level.level}>
                                                    {level.description} — {level.juz}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>

                        <Row gutter={16}>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="student_age_preference"
                                    label={t('teacher.agePreference')}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder={t('teacher.agePreference')}
                                    >
                                        {agePreferences.map(age => (
                                            <Option key={age.value} value={age.value}>
                                                {age.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="hourly_rate_cents"
                                    label={t('teacher.hourlyRate')}
                                >
                                    <InputNumber
                                        min={0}
                                        formatter={value => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/₪\s?|(,*)/g, '')}
                                        style={{ width: '100%' }}
                                        placeholder="0.00"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Card>

                <Divider />

                {/* Mosque Preferences Section */}
                <Card className="form-section-card">
                    <div className="form-section">
                        <h3>
                            <EnvironmentOutlined style={{ marginLeft: 8 }} />
                            {t('teacher.preferredMosques') || 'المساجد المفضلة'}
                        </h3>

                        <Form.Item
                            name="preferred_mosques"
                            label={t('teacher.preferredMosques')}
                            rules={[{ required: true, message: t('teacher.selectMosque') }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder={t('teacher.preferredMosques')}
                                optionLabelProp="label"
                                loading={loadingMosques}
                                notFoundContent={loadingMosques ? <Spin size="small" /> : 'لا توجد مساجد'}
                                tagRender={({ label, onClose }) => (
                                    <Tag closable onClose={onClose} style={{ margin: 2 }}>
                                        {label}
                                    </Tag>
                                )}
                            >
                                {mosques.map(mosque => (
                                    <Option key={mosque.id} value={mosque.id} label={mosque.name}>
                                        <div>
                                            <strong>{mosque.name}</strong>
                                            {mosque.governorate && (
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {mosque.governorate}
                                                </div>
                                            )}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="preferred_teaching_format"
                            label={t('teacher.teachingFormat')}
                            rules={[{ required: true, message: t('teacher.selectFormat') }]}
                        >
                            <Select placeholder="اختر نمط التدريس">
                                {teachingFormats.map(format => (
                                    <Option key={format.value} value={format.value}>
                                        {format.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </Card>

                <Divider />

                {/* Availability Section */}
                <Card className="form-section-card">
                    <div className="form-section">
                        <h3>
                            <ClockCircleOutlined style={{ marginLeft: 8 }} />
                            {t('teacher.availability') || 'أوقات التفرغ'}
                        </h3>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                            {t('teacher.selectDaysandTimes')}
                        </p>

                        {daysOfWeek.map(day => (
                            <Row gutter={16} key={day.value} style={{ marginBottom: '1rem', alignItems: 'center' }}>
                                <Col xs={24} md={4}>
                                    <Form.Item
                                        name={['availability', day.value, 'available']}
                                        valuePropName="checked"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Checkbox>{day.label}</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={20}>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) =>
                                            prevValues.availability?.[day.value]?.available !==
                                            currentValues.availability?.[day.value]?.available
                                        }
                                    >
                                        {() => {
                                            const isAvailable = form.getFieldValue(['availability', day.value, 'available']);
                                            return isAvailable ? (
                                                <Form.Item
                                                    name={['availability', day.value, 'timeSlots']}
                                                    style={{ marginBottom: 0 }}
                                                    rules={[{ required: true, message: 'الرجاء تحديد الوقت' }]}
                                                >
                                                    <TimePicker.RangePicker
                                                        style={{ width: '100%' }}
                                                        placeholder={[t('time.start'), t('time.end')]}
                                                        format="HH:mm"
                                                    />
                                                </Form.Item>
                                            ) : null;
                                        }}
                                    </Form.Item>
                                </Col>
                            </Row>
                        ))}
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default MosquePreferencesForm;