import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">Loading...</h2>
                <p className="text-gray-500">Fetching your profile...</p>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome, {user.full_name || "User"} 👋
                </h1>
                <p className="text-gray-600 mb-6">
                    You are logged in to your account dashboard.
                </p>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                    <p>
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    {user.gender && (
                        <p>
                            <span className="font-semibold">Gender:</span> {user.gender}
                        </p>
                    )}
                    {user.dob && (
                        <p>
                            <span className="font-semibold">Date of Birth:</span> {user.dob}
                        </p>
                    )}
                    <p>
                        <span className="font-semibold">Approved:</span>{" "}
                        {user.approved ? "✅ Yes" : "❌ Pending"}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
