import React from "react";
import { Link, useLocation } from "react-router-dom";

const Card = ({ job }) => {
  return (
    <div className="border m-4">
      <div>{job.job_title}</div>
      <div>{job.job_location}</div>
      <div>
        salary: {job.salary.min}-{job.salary.max}
      </div>
      <Link to={job._id}>
        <div className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          Apply now
        </div>
      </Link>
    </div>
  );
};

export default Card;
