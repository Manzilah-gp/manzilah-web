import { useState } from 'react';
import { registerTeacher } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

export const useTeacherRegistration = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const submitRegistration = async (formData) => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                // Personal info
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                gender: formData.gender,
                dob: formData.dob,

                // Location data
                address: {
                    address_line1: formData.address.address_line1,
                    address_line2: formData.address.address_line2,
                    region: formData.address.region,
                    governorate: formData.address.governorate,
                    postal_code: formData.address.postal_code,
                    latitude: formData.address.latitude,
                    longitude: formData.address.longitude,
                },

                // Certification data
                certification: {
                    has_tajweed_certificate: formData.has_tajweed_certificate,
                    has_sharea_certificate: formData.has_sharea_certificate,
                    tajweed_certificate_url: formData.tajweed_certificate_url,
                    sharea_certificate_url: formData.sharea_certificate_url,
                    experience_years: formData.experience_years,
                    previous_mosques: formData.previous_mosques,
                    additional_qualifications: formData.additional_qualifications,
                    preferred_teaching_format: formData.preferred_teaching_format,
                    student_age_preference: formData.student_age_preference,
                    hourly_rate_cents: formData.hourly_rate_cents,
                },

                // Expertise
                expertise: formData.course_expertise, // Array of {course_type_id, max_level}

                // Availability
                availability: formData.availability, // Array of time slots

                // Preferred mosques
                preferred_mosques: formData.preferred_mosques, // Array of mosque IDs
            };

            const response = await registerTeacher(payload);

            setLoading(false);

            // ✅ Navigate to success page or login
            setTimeout(() => {
                navigate('/login');
            }, 2000);

            return { success: true, data: response.data };

        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    return { submitRegistration, loading, error };
};