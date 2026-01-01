/**
 * ProfileDetails Component
 * 
 * Allows users to view and edit their profile information
 * Includes personal details and location information
 * Features mobile responsive design with collapsible sidebar
 */

import React, { useState, useEffect } from "react";
import MainSideBar from "../components/MainSideBar/MainSideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/ProfileDetails.css";
import { message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

function ProfileDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Sidebar state management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    birthday: "",
    governorate: "",
    region: "",
    address_line1: "",
    address_line2: "",
    postal_code: ""
  });

  // Palestine governorates list
  const governorates = [
    { value: "jerusalem", label: "Jerusalem" },
    { value: "gaza", label: "Gaza" },
    { value: "ramallah", label: "Ramallah" },
    { value: "hebron", label: "Hebron" },
    { value: "bethlehem", label: "Bethlehem" },
    { value: "nablus", label: "Nablus" },
    { value: "jenin", label: "Jenin" },
    { value: "tulkarm", label: "Tulkarm" },
    { value: "qalqilya", label: "Qalqilya" },
    { value: "tubas", label: "Tubas" },
    { value: "salfit", label: "Salfit" },
    { value: "jericho", label: "Jericho" }
  ];

  /**
   * Auto-collapse sidebar on mobile when route changes
   */
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname]);

  /**
   * Handle window resize - collapse sidebar on mobile
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Fetch user profile on component mount
   */
  useEffect(() => {
    fetchUserProfile();
  }, []);

  /**
   * Fetch user profile data from backend
   */
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();

      if (data.success && data.user) {
        setUser({
          fullName: data.user.full_name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          gender: data.user.gender || "",
          birthday: data.user.dob ? data.user.dob.split('T')[0] : "",
          governorate: data.user.location?.governorate || "",
          region: data.user.location?.region || "",
          address_line1: data.user.location?.address_line1 || "",
          address_line2: data.user.location?.address_line2 || "",
          postal_code: data.user.location?.postal_code || ""
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Failed to load profile data');
      setLoading(false);
    }
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission - save profile changes
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      // Update basic profile information
      const profileResponse = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: user.fullName,
          email: user.email,
          phone: user.phone,
          dob: user.birthday,
          gender: user.gender
        })
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      // Update location information
      const locationResponse = await fetch('http://localhost:5000/api/profile/location', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          governorate: user.governorate,
          region: user.region,
          address_line1: user.address_line1,
          address_line2: user.address_line2,
          postal_code: user.postal_code
        })
      });

      if (!locationResponse.ok) {
        throw new Error('Failed to update location');
      }

      message.success('Profile updated successfully');
      
      // Navigate back to profile page after 1 second
      setTimeout(() => {
        navigate('/profile');
      }, 1000);

    } catch (error) {
      console.error('Error saving profile:', error);
      message.error(error.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Calculate age from birthday
   */
  const calculateAge = (birthday) => {
    if (!birthday) return "";
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  /**
   * Toggle sidebar collapsed state
   */
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <MainSideBar
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <div className="main-content-wrapper">
          <div className="profile-container">
            <h2 className="profile-title">Loading...</h2>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Sidebar with collapse functionality */}
      <MainSideBar
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      <div className="main-content-wrapper">
        <div className="profile-container">
          <h2 className="profile-title">Edit Profile</h2>

          <form className="profile-form" onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={user.fullName} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={user.email} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={user.phone} 
                  onChange={handleChange}
                  placeholder="970599123456"
                />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select 
                  name="gender" 
                  value={user.gender} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth *</label>
                <input 
                  type="date" 
                  name="birthday" 
                  value={user.birthday} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input 
                  type="text" 
                  value={calculateAge(user.birthday) ? `${calculateAge(user.birthday)} years` : ""} 
                  disabled
                  style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            {/* Location Information Section */}
            <h3 style={{ marginTop: '30px', marginBottom: '15px', color: '#1d4ed8' }}>
              Address Information
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>Governorate</label>
                <select 
                  name="governorate" 
                  value={user.governorate} 
                  onChange={handleChange}
                >
                  <option value="">Select Governorate</option>
                  {governorates.map((gov) => (
                    <option key={gov.value} value={gov.value}>
                      {gov.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Region/City</label>
                <input 
                  type="text" 
                  name="region" 
                  value={user.region} 
                  onChange={handleChange}
                  placeholder="e.g., Al-Bireh, Old City"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Address Line 1</label>
                <input 
                  type="text" 
                  name="address_line1" 
                  value={user.address_line1} 
                  onChange={handleChange}
                  placeholder="Street, Building Number"
                />
              </div>

              <div className="form-group">
                <label>Address Line 2</label>
                <input 
                  type="text" 
                  name="address_line2" 
                  value={user.address_line2} 
                  onChange={handleChange}
                  placeholder="Additional Details"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input 
                  type="text" 
                  name="postal_code" 
                  value={user.postal_code} 
                  onChange={handleChange}
                  placeholder="12345"
                />
              </div>
              <div className="form-group">
                {/* Empty div for grid alignment */}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="save-btn"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProfileDetails;