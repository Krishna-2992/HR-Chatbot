import React, { useState } from "react";

const UploadJob = () => {
  // Get a date 30 days from now for the application deadline
  const getDefaultDeadline = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().slice(0, 16); // Format for datetime-local input
  };

  const [formData, setFormData] = useState({
    job_title: "Senior Frontend Developer",
    job_type: "full-time",
    company: "TechCorp Inc.",
    work_arrangement: "remote",
    job_location: "San Francisco, CA",
    job_description: {
      role_summary:
        "We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building user-facing features and ensuring the technical feasibility of UI/UX designs.",
      key_responsibility:
        "Develop new user-facing features using React.js, Build reusable components and front-end libraries, Ensure the technical feasibility of UI/UX designs, Optimize application for maximum speed and scalability, Collaborate with back-end developers and web designers to improve usability",
      requirements: {
        experience: 3,
        skills: ["React", "JavaScript", "TypeScript", "HTML/CSS", "Git"],
        education: "Bachelor's degree in Computer Science or related field",
        certifications: [
          "AWS Certified Developer",
          "React Developer Certification",
        ],
      },
    },
    salary: {
      min: "80000",
      max: "120000",
      currency: "USD",
      period: "annual",
    },
    application_deadline: getDefaultDeadline(),
    job_status: "draft",
    job_uuid: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes for nested objects
  const handleInputChange = (path, value) => {
    const keys = path.split(".");
    console.log("keys: ", keys);
    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Handle array changes (skills, certifications)
  const handleArrayChange = (path, index, value) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      const newArray = [...current[keys[keys.length - 1]]];
      newArray[index] = value;
      current[keys[keys.length - 1]] = newArray;

      return newData;
    });
  };

  // Add new item to array
  const addArrayItem = (path) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = [...current[keys[keys.length - 1]], ""];
      return newData;
    });
  };

  // Remove item from array
  const removeArrayItem = (path, index) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      const newArray = current[keys[keys.length - 1]].filter(
        (_, i) => i !== index
      );
      current[keys[keys.length - 1]] = newArray.length === 0 ? [""] : newArray;

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Clean up the data before sending
      const cleanedData = {
        ...formData,
        job_description: {
          ...formData.job_description,
          requirements: {
            ...formData.job_description.requirements,
            skills: formData.job_description.requirements.skills.filter(
              (skill) => skill.trim() !== ""
            ),
            certifications:
              formData.job_description.requirements.certifications.filter(
                (cert) => cert.trim() !== ""
              ),
            experience: parseInt(
              formData.job_description.requirements.experience
            ),
          },
        },
        salary: {
          ...formData.salary,
          min: parseInt(formData.salary.min),
          max: parseInt(formData.salary.max),
        },
        application_deadline: new Date(
          formData.application_deadline
        ).toISOString(),
        posted_date: new Date().toISOString(),
      };

      console.log("=== DEBUGGING INFO ===");
      console.log(
        "1. Cleaned data to send:",
        JSON.stringify(cleanedData, null, 2)
      );
      console.log("2. API URL:", "http://127.0.0.1:8000/jobs");
      console.log("3. Method:", "POST");

      const response = await fetch("http://127.0.0.1:8000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      console.log("4. Response received:");
      console.log("   - Status:", response.status);
      console.log("   - Status Text:", response.statusText);
      console.log("   - Headers:", [...response.headers.entries()]);

      const responseText = await response.text();
      console.log("5. Response body:", responseText);

      if (response.ok) {
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = responseText;
        }
        console.log("6. Parsed result:", result);
        alert("Job posted successfully!");
      } else {
        console.error("7. Error response details:", {
          status: response.status,
          statusText: response.statusText,
          body: responseText,
        });
        alert(`Error: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      console.error("8. Fetch error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      alert(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Job</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Job Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.job_title}
                onChange={(e) => handleInputChange("job_title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                required
                value={formData.job_type}
                onChange={(e) => handleInputChange("job_type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Arrangement *
              </label>
              <select
                required
                value={formData.work_arrangement}
                onChange={(e) =>
                  handleInputChange("work_arrangement", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On Site</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Status
              </label>
              <select
                value={formData.job_status}
                onChange={(e) =>
                  handleInputChange("job_status", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Location *
            </label>
            <input
              type="text"
              required
              value={formData.job_location}
              onChange={(e) =>
                handleInputChange("job_location", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. New York, NY or Remote"
            />
          </div>

          {/* Job Description Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Job Description
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Summary * (min 10 characters)
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.job_description.role_summary}
                  onChange={(e) =>
                    handleInputChange(
                      "job_description.role_summary",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary of the role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Responsibilities * (min 10 characters)
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.job_description.key_responsibility}
                  onChange={(e) =>
                    handleInputChange(
                      "job_description.key_responsibility",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List the main responsibilities..."
                />
              </div>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Requirements
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.job_description.requirements.experience}
                  onChange={(e) =>
                    handleInputChange(
                      "job_description.requirements.experience",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education *
                </label>
                <input
                  type="text"
                  required
                  value={formData.job_description.requirements.education}
                  onChange={(e) =>
                    handleInputChange(
                      "job_description.requirements.education",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Bachelor's in Computer Science"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills * (at least one)
              </label>
              {formData.job_description.requirements.skills.map(
                (skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) =>
                        handleArrayChange(
                          "job_description.requirements.skills",
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. React, JavaScript, Python"
                    />
                    {formData.job_description.requirements.skills.length >
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem(
                            "job_description.requirements.skills",
                            index
                          )
                        }
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )
              )}
              <button
                type="button"
                onClick={() =>
                  addArrayItem("job_description.requirements.skills")
                }
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Skill
              </button>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications (optional)
              </label>
              {formData.job_description.requirements.certifications.map(
                (cert, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) =>
                        handleArrayChange(
                          "job_description.requirements.certifications",
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. AWS Certified, PMP"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem(
                          "job_description.requirements.certifications",
                          index
                        )
                      }
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
              <button
                type="button"
                onClick={() =>
                  addArrayItem("job_description.requirements.certifications")
                }
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Certification
              </button>
            </div>
          </div>

          {/* Salary Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Salary Information
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.salary.min}
                  onChange={(e) =>
                    handleInputChange("salary.min", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.salary.max}
                  onChange={(e) =>
                    handleInputChange("salary.max", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <input
                  type="text"
                  required
                  maxLength="3"
                  minLength="3"
                  value={formData.salary.currency}
                  onChange={(e) =>
                    handleInputChange(
                      "salary.currency",
                      e.target.value.toUpperCase()
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="USD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Period *
                </label>
                <select
                  required
                  value={formData.salary.period}
                  onChange={(e) =>
                    handleInputChange("salary.period", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="annual">Annual</option>
                  <option value="monthly">Monthly</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Application Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.application_deadline}
              onChange={(e) =>
                handleInputChange("application_deadline", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
          >
            {isSubmitting ? "Posting Job..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadJob;
