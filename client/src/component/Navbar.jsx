import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 py-3">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">JobPortal</h1>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/upload-job"
              className={`px-5 py-2 font-medium rounded-lg transition-colors duration-200 ${
                location.pathname === "/upload-job"
                  ? "bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Upload Job
            </Link>

            <Link
              to="/jobs"
              className={`px-5 py-2 font-medium rounded-lg transition-colors duration-200 ${
                location.pathname === "/jobs"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              See All Jobs
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
