import React, { useState, useEffect } from "react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/jobs", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const jobsData = await response.json();
        console.log(jobsData);
        setJobs(jobsData);
      } else {
        setError(`Failed to fetch jobs: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search term and filter type
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "all" || job.job_type === filterType;

    return matchesSearch && matchesFilter;
  });

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return "Salary not specified";

    const { min, max, currenct, period } = salary;
    const currency = currenct || "USD";

    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} / ${period}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+ / ${period}`;
    }
    return "Salary not specified";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get job type badge color
  const getJobTypeBadge = (jobType) => {
    const colors = {
      "full-time": "bg-green-100 text-green-800",
      "part-time": "bg-blue-100 text-blue-800",
      contract: "bg-purple-100 text-purple-800",
      temporary: "bg-yellow-100 text-yellow-800",
      internship: "bg-pink-100 text-pink-800",
    };
    return colors[jobType] || "bg-gray-100 text-gray-800";
  };

  // Get work arrangement icon
  const getWorkArrangementIcon = (arrangement) => {
    switch (arrangement) {
      case "remote":
        return "🏠";
      case "hybrid":
        return "🔄";
      case "on-site":
        return "🏢";
      default:
        return "📍";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading jobs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchJobs}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Dream Job
        </h1>
        <p className="text-gray-600">
          Discover {jobs.length} amazing opportunities waiting for you
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <input
                type="text"
                placeholder="Search jobs, companies, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="md:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Job Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No jobs found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
            >
              {/* Job Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {job.job_title}
                  </h2>
                  <p className="text-blue-600 font-medium text-lg mb-1">
                    {job.company}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeBadge(
                      job.job_type
                    )}`}
                  >
                    {job.job_type.replace("-", " ").toUpperCase()}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.job_status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {job.job_status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Location and Work Arrangement */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <span className="text-sm">{job.job_location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-1">
                    {getWorkArrangementIcon(job.work_arrangement)}
                  </span>
                  <span className="text-sm capitalize">
                    {job.work_arrangement}
                  </span>
                </div>
              </div>

              {/* Job Description Preview */}
              <div className="mb-4">
                <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
                  {job.job_description?.role_summary ||
                    "No description available"}
                </p>
              </div>

              {/* Skills Preview */}
              {job.job_description?.requirements?.skills &&
                job.job_description.requirements.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {job.job_description.requirements.skills
                        .slice(0, 3)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {skill}
                          </span>
                        ))}
                      {job.job_description.requirements.skills.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          +{job.job_description.requirements.skills.length - 3}{" "}
                          more
                        </span>
                      )}
                    </div>
                  </div>
                )}

              {/* Salary and Experience */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-green-600">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                  <span className="text-sm font-medium">
                    {formatSalary(job.salary)}
                  </span>
                </div>
                {job.job_description?.requirements?.experience !==
                  undefined && (
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
                      ></path>
                    </svg>
                    <span className="text-sm">
                      {job.job_description.requirements.experience} years
                      experience
                    </span>
                  </div>
                )}
              </div>

              {/* Application Deadline */}
              <div className="flex items-center justify-between mb-4 pt-4 border-t">
                <div className="flex items-center text-gray-500">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="text-xs">
                    Apply by: {formatDate(job.application_deadline)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Posted: {formatDate(job.posted_date)}
                </div>
              </div>

              {/* Apply Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 transform group-hover:scale-105">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
