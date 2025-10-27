import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
                Go to Dashboard
            </button>
        </div>
    );
};

export default Unauthorized;