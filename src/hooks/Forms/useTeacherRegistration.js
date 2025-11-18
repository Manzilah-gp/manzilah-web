// src/hooks/useTeacherRegistration.js
import { useState } from 'react';
import { message } from 'antd';

export const useTeacherRegistration = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitRegistration = async (formData) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In real implementation, this would be:
            // const userResponse = await axios.post('/api/teachers/register', {
            //   user: {
            //     full_name: formData.full_name,
            //     email: formData.email,
            //     phone: formData.phone,
            //     password: formData.password,
            //     gender: formData.gender,
            //     dob: formData.dob,
            //   },
            //   teacher_certification: {
            //     has_tajweed_certificate: formData.has_tajweed_certificate,
            //     has_sharea_certificate: formData.has_sharea_certificate,
            //     tajweed_certificate_url: formData.tajweed_certificate_url,
            //     sharea_certificate_url: formData.sharea_certificate_url,
            //     experience_years: formData.experience_years,
            //     previous_mosques: formData.previous_mosques,
            //     additional_qualifications: formData.additional_qualifications,
            //     status: 'pending'
            //   },
            //   teacher_expertise: formData.course_expertise.map(courseId => ({
            //     course_type_id: courseId,
            //     max_level_qualified: 3, // This would be dynamic based on user selection
            //     teaching_style: formData.teaching_style,
            //     student_age_preference: formData.student_age_preference,
            //     hourly_rate_cents: formData.hourly_rate_cents,
            //     is_accepting_students: formData.is_accepting_students
            //   })),
            //   preferences: {
            //     preferred_mosques: formData.preferred_mosques,
            //     availability: formData.availability,
            //     preferred_teaching_format: formData.preferred_teaching_format
            //   }
            // });

            // Mock success response
            return { success: true, userId: 'mock-user-id' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { submitRegistration, loading, error };
};