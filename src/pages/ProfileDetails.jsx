import React, { useState } from "react";
import Sidebar from "../components/Side";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../Styles/ProfileDetails.css";

function ProfileDetails() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    age: "",
    gender: "",
    birthday: "",
    bio: "",
    username: "",
  });

  const palestineCities = [
    "Jerusalem",
    "Gaza",
    "Ramallah",
    "Hebron",
    "Bethlehem",
    "Nablus",
    "Jenin",
    "Tulkarm",
    "Qalqilya",
    "Tubas",
    "Salfit",
    "Rafah",
    "Khan Yunis",
    "Jericho",
  ];

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />

      <div className="profile-layout">
        <Sidebar />

        <div className="profile-container">

          <h2 className="profile-title">User Profile</h2>

          <form className="profile-form">

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={user.fullName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" value={user.username} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={user.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value={user.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <select name="city" value={user.city} onChange={handleChange}>
                  <option value="">Select City</option>
                  {palestineCities.map((city, i) => (
                    <option key={i} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={user.age} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={user.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Birthday</label>
                <input type="date" name="birthday" value={user.birthday} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group full">
              <label>About Me</label>
              <textarea name="bio" value={user.bio} onChange={handleChange}></textarea>
            </div>

            <button className="save-btn">Save Changes</button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProfileDetails;
