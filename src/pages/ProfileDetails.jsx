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

  const governorates = [
    { value: "jerusalem", label: "القدس" },
    { value: "gaza", label: "غزة" },
    { value: "ramallah", label: "رام الله" },
    { value: "hebron", label: "الخليل" },
    { value: "bethlehem", label: "بيت لحم" },
    { value: "nablus", label: "نابلس" },
    { value: "jenin", label: "جنين" },
    { value: "tulkarm", label: "طولكرم" },
    { value: "qalqilya", label: "قلقيلية" },
    { value: "tubas", label: "طوباس" },
    { value: "salfit", label: "سلفيت" },
    { value: "jericho", label: "أريحا" }
  ];

  // ✅ Auto-collapse sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname]);

  // ✅ Handle window resize
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

  useEffect(() => {
    fetchUserProfile();
  }, []);

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
      message.error('فشل تحميل البيانات');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      // Update basic info
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

      // Update location
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

      message.success('تم حفظ التغييرات بنجاح');

      setTimeout(() => {
        navigate('/profile');
      }, 1000);

    } catch (error) {
      console.error('Error saving profile:', error);
      message.error(error.message || 'فشل حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

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

  // ✅ Toggle sidebar function
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <>
      <div className="main-content-wrapper">
        <div className="profile-container">
          <h2 className="profile-title">تعديل الملف الشخصي</h2>

          <form className="profile-form" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="form-row">
              <div className="form-group">
                <label>الاسم الكامل *</label>
                <input
                  type="text"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني *</label>
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
                <label>رقم الهاتف</label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  placeholder="970599123456"
                />
              </div>

              <div className="form-group">
                <label>الجنس *</label>
                <select
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>تاريخ الميلاد *</label>
                <input
                  type="date"
                  name="birthday"
                  value={user.birthday}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>العمر</label>
                <input
                  type="text"
                  value={calculateAge(user.birthday) ? `${calculateAge(user.birthday)} سنة` : ""}
                  disabled
                  style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            {/* Location Information */}
            <h3 style={{ marginTop: '30px', marginBottom: '15px', color: '#1d4ed8' }}>
              معلومات العنوان
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>المحافظة</label>
                <select
                  name="governorate"
                  value={user.governorate}
                  onChange={handleChange}
                >
                  <option value="">اختر المحافظة</option>
                  {governorates.map((gov) => (
                    <option key={gov.value} value={gov.value}>
                      {gov.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>المنطقة/المدينة</label>
                <input
                  type="text"
                  name="region"
                  value={user.region}
                  onChange={handleChange}
                  placeholder="مثال: البيرة، البلدة القديمة"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>العنوان 1</label>
                <input
                  type="text"
                  name="address_line1"
                  value={user.address_line1}
                  onChange={handleChange}
                  placeholder="الشارع، رقم المبنى"
                />
              </div>

              <div className="form-group">
                <label>العنوان 2</label>
                <input
                  type="text"
                  name="address_line2"
                  value={user.address_line2}
                  onChange={handleChange}
                  placeholder="تفاصيل إضافية"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>الرمز البريدي</label>
                <input
                  type="text"
                  name="postal_code"
                  value={user.postal_code}
                  onChange={handleChange}
                  placeholder="12345"
                />
              </div>
              <div className="form-group">
                {/* Empty for alignment */}
              </div>
            </div>

            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </form>
        </div>
      </div>

    </>
  );
}

export default ProfileDetails;