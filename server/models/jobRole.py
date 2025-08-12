from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class JobType(str, Enum):
    FULL_TIME = "full-time"
    PART_TIME = "part-time" 
    CONTRACT = "contract"
    TEMPORARY = "temporary"
    INTERNSHIP = "internship"

class WorkArrangement(str, Enum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    ON_SITE = "on-site"

class SalaryPeriod(str, Enum):
    ANNUAL = "annual"
    MONTHLY = "monthly"
    HOURLY = "hourly"

class JobStatus(str, Enum):
    ACTIVE = "active"
    CLOSED = "closed"
    DRAFT = "draft"

class Requirements(BaseModel): 
    experience: int = Field(..., ge=0, description="Years of experience required")
    skills: List[str] = Field(..., min_length=1)
    education: str
    certifications: List[str] = Field(default_factory=list)

class JobDescription(BaseModel): 
    role_summary: str = Field(..., min_length=10)
    key_responsibility: str = Field(..., min_length=10)
    requirements: Requirements

class Salary(BaseModel): 
    min: float = Field(..., gt=0)
    max: float = Field(..., gt=0)
    currency: str = Field(..., min_length=3, max_length=3)
    period: SalaryPeriod

    def validate_salary_range(self):
        if self.min > self.max:
            raise ValueError("Minimum salary cannot be greater than maximum salary")

class JobRole(BaseModel):
    job_title: str
    job_type: JobType
    company: str
    work_arrangement: WorkArrangement
    job_location: str
    job_description: JobDescription
    salary: Salary
    application_deadline: datetime
    posted_date: datetime = Field(default_factory=datetime.utcnow)
    job_status: JobStatus = JobStatus.DRAFT
    job_uuid: str
    