// src/hooks/Forms/useTeacherRegistration.js
import { useState } from 'react';
import { registerTeacher } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export const useTeacherRegistration = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    /**
     * Transform time slots from Ant Design format to database format
     */
    const transformAvailability = (availability) => {
        const slots = [];

        Object.keys(availability).forEach(day => {
            const dayData = availability[day];

            if (dayData?.available && dayData?.timeSlots) {
                // timeSlots is a dayjs RangePicker array [start, end]
                const [startTime, endTime] = dayData.timeSlots;

                if (startTime && endTime) {
                    slots.push({
                        day_of_week: day,
                        start_time: startTime.format('HH:mm:ss'),
                        end_time: endTime.format('HH:mm:ss')
                    });
                }
            }
        });

        return slots;
    };

    /**
     * Transform course expertise to backend format
     */
    const transformExpertise = (courseExpertise, maxLevel, formData) => {
        return courseExpertise.map(courseTypeId => {
            const exp = {
                course_type_id: courseTypeId,
                years_experience: formData.experience_years || 0,
                hourly_rate_cents: formData.hourly_rate_cents || 0
            };

            // If memorization is selected (courseTypeId === 1)
            if (courseTypeId === 1 && maxLevel) {
                exp.is_memorization_selected = true;
                exp.max_mem_level_id = maxLevel;
            }

            return exp;
        });
    };

    const submitRegistration = async (formData) => {
        setLoading(true);
        setError(null);

        try {
            console.log("🔄 Submitting teacher registration...");
            console.log("Form Data:", formData);

            // Transform data to match backend expectations
            const payload = {
                // Personal info
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                gender: formData.gender,
                dob: formData.dob ? dayjs(formData.dob).format('YYYY-MM-DD') : null,

                // Location data
                address: formData.address ? {
                    address_line1: formData.address.address_line1,
                    address_line2: formData.address.address_line2,
                    region: formData.address.region,
                    governorate: formData.address.governorate,
                    postal_code: formData.address.postal_code,
                    latitude: formData.address.latitude,
                    longitude: formData.address.longitude,
                } : null,

                // Certification data
                certification: {
                    has_tajweed_certificate: formData.has_tajweed_certificate || false,
                    has_sharea_certificate: formData.has_sharea_certificate || false,
                    tajweed_certificate_url: formData.tajweed_certificate_url || null,
                    sharea_certificate_url: formData.sharea_certificate_url || null,
                    experience_years: formData.experience_years || 0,
                    previous_mosques: formData.previous_mosques || [],
                    additional_qualifications: formData.additional_qualifications || '',
                    preferred_teaching_format: formData.preferred_teaching_format || 'onsite',
                    student_age_preference: formData.student_age_preference || [],
                    hourly_rate_cents: formData.hourly_rate_cents || 0,
                },

                // Transform expertise
                expertise: transformExpertise(
                    formData.course_expertise || [],
                    formData.max_level_qualified,
                    formData
                ),

                // Transform availability
                availability: transformAvailability(formData.availability || {}),

                // Preferred mosques
                preferred_mosques: formData.preferred_mosques || [],
            };

            console.log("📤 Transformed Payload:", JSON.stringify(payload, null, 2));

            const response = await registerTeacher(payload);

            console.log("✅ Registration successful:", response.data);

            setLoading(false);

            // Navigate to success page or login
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'تم تقديم طلب التسجيل بنجاح! يرجى انتظار موافقة الإدارة.'
                    }
                });
            }, 2000);

            return { success: true, data: response.data };

        } catch (err) {
            setLoading(false);
            console.error("❌ Registration error:", err);

            const errorMessage = err.response?.data?.message || 'فشل في التسجيل. يرجى المحاولة مرة أخرى.';
            setError(errorMessage);

            return { success: false, error: errorMessage };
        }
    };

    return { submitRegistration, loading, error };
};