import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // use the context
import { loginUser } from "../../api/auth"; // Import from auth.js


const Login = () => {
    const { setUser } = useAuth();
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Full URL would be:", import.meta.env.VITE_API_URL + "/users/login");

        try {
            const res = await loginUser(email, password);
            const { token, user } = res.data;

            localStorage.setItem("token", token);

            // set user in context with roles and children
            setUser({
                ...user,
                roles: user.roles,
                children: user.children || [],
            });

            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);

            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
