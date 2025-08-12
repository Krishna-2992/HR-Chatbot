from models.jobRole import JobRole

def build_job_embedding_text(job: JobRole) -> str:
    jd = job.job_description
    req = jd.requirements

    lines = [
        f"Role Summary: {jd.role_summary}", 
        f"Key Responsibilities: {jd.key_responsibility}", 
        f"Skills Required: {', '.join(req.skills)}", 
        f"Experience Required: {req.experience} years", 
        f"Education: {req.education}"
    ]
    if req.certifications: 
        lines.append(f"Certifications: {' ,'.join(req.certifications)}")

    return '\n'.join(lines)
