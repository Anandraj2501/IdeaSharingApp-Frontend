import React from "react";

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
            <p className="ml-4 text-lg text-gray-600 font-medium">Loading...</p>
        </div>
    );
};

export default Loader;
