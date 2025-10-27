import React, { useState } from "react";
import { registerUser } from "../../api/auth";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        date_of_birth: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ✅ Good - using the centralized auth function
            const res = await registerUser(form);
            setMessage("Registration successful! You can now log in.");

            // Optional: Clear form after successful registration
            setForm({
                name: "",
                email: "",
                password: "",
                gender: "",
                date_of_birth: "",
            });

        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name} // ✅ Add value for controlled component
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email} // ✅ Add value for controlled component
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password} // ✅ Add value for controlled component
                    onChange={handleChange}
                    required
                />
                <select
                    name="gender"
                    value={form.gender} // ✅ Add value for controlled component
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                </select>
                <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth} // ✅ Add value for controlled component
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;