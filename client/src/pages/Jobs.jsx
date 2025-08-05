import React, { useState, useEffect } from "react";
import Card from "../component/Card";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div>
      working
      {jobs.map((job) => (
        <Card key={job._id} job={job} />
      ))}
    </div>
  );
};

export default Jobs;
