import React from 'react';
import { Form, Select, Checkbox, InputNumber, TimePicker, Row, Col, Card, Tag, Divider } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, ReadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { RangePicker } = TimePicker;

const MosquePreferencesForm = ({ formData, updateFormData }) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const onValuesChange = (changedValues, allValues) => {
        updateFormData(allValues);
    };

    const courseTypes = [
        { value: 1, label: t('course.memorization'), levels: 6 },
        { value: 2, label: t('course.tajweed'), levels: 4 },
        { value: 3, label: t('course.feqh'), levels: 3 }
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
        { value: 'children', label: t('age.children') },
        { value: 'teens', label: t('age.teens') },
        { value: 'adults', label: t('age.adults') },
        { value: 'all', label: t('age.all') }
    ];

    const mockMosques = [
        { id: 1, name: 'مسجد الأقصى - غزة', city: 'غزة' },
        { id: 2, name: 'المسجد الكبير - نابلس', city: 'نابلس' },
        { id: 3, name: 'الحرم الإبراهيمي - الخليل', city: 'الخليل' },
        { id: 4, name: 'الجامع الكبير - رام الله', city: 'رام الله' },
        { id: 5, name: 'مسجد القدس - القدس', city: 'القدس' },
    ];

    const daysOfWeek = [
        { value: 'sunday', label: t('day.sunday') },
        { value: 'monday', label: t('day.monday') },
        { value: 'tuesday', label: t('day.tuesday') },
        { value: 'wednesday', label: t('day.wednesday') },
        { value: 'thursday', label: t('day.thursday') },
        { value: 'friday', label: t('day.friday') },
        { value: 'saturday', label: t('day.saturday') }
    ];

    const teachingFormats = [
        { value: 'online', label: t('format.online') },
        { value: 'onsite', label: t('format.onsite') },
        { value: 'hybrid', label: t('format.hybrid') }
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
                            {t('teacher.preferences')}
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
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                حتى المستوى {course.levels}
                                            </div>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="max_level_qualified"
                            label={t('teacher.maxLevel')}
                            rules={[{ required: true, message: t('teacher.selectMaxLevel') }]}
                        >
                            <Select placeholder={t('teacher.maxLevel')}>
                                {memorizationLevels.map(level => (
                                    <Option key={level.level} value={level.level}>
                                        المستوى {level.level} - {level.juz}
                                    </Option>
                                ))}
                            </Select>
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
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="hourly_rate_cents"
                                    label={t('teacher.hourlyRate')}
                                >
                                    <InputNumber
                                        min={0}
                                        formatter={value => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
                            {t('teacher.preferredMosques')}
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
                                tagRender={({ label, onClose }) => (
                                    <Tag closable onClose={onClose} style={{ margin: 2 }}>
                                        {label}
                                    </Tag>
                                )}
                            >
                                {mockMosques.map(mosque => (
                                    <Option key={mosque.id} value={mosque.id} label={mosque.name}>
                                        <div>
                                            <strong>{mosque.name}</strong>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {mosque.city}
                                            </div>
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
                            <Select placeholder={t('teacher.teachingFormat')}>
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
                            {t('teacher.availability')}
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
                                        <Checkbox>
                                            {day.label}
                                        </Checkbox>
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
                                                >
                                                    <RangePicker
                                                        style={{ width: '100%' }}
                                                        placeholder={[t('time.start'), t('time.end')]}
                                                        format="HH:mm"
                                                        picker="time"
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

// Notes: new file created for MosquePreferencesForm component 11/11/2025=> 4:50 PM