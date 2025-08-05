import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to JobPortal
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Find your dream job or post job opportunities
      </p>

      <div className="flex justify-center space-x-4">
        <Link
          to="/jobs"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Browse Jobs
        </Link>

        <Link
          to="/upload-job"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Post a Job
        </Link>
      </div>
    </div>
  );
};

export default Home;
