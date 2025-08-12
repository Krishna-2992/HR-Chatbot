from fastapi import FastAPI, HTTPException, UploadFile, File
from pymongo import MongoClient
from models.jobRole import JobRole
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import boto3
from botocore.exceptions import NoCredentialsError, ClientError
import uuid
import os
from utils.PdfTextExtractor import extract_text_from_pdf_bytes
from utils.EmbeddingGenerator import EmbeddingGenerator
from datetime import datetime
from utils.JobUtils import build_job_embedding_text
# from utils.PineConeStore import PineconeStore
from utils.PineCone2 import PineCone2
from utils.CosineSimilarity import cosine_similarity
 
# Load environment variables
load_dotenv()

# AWS S3 Configuration - Use consistent values
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

# Initialize S3 client with your credentials
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID, 
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

# MongoDB connection
client = MongoClient(
    os.getenv("MONGODB_URL")
)
db = client["test_db"]
job_posting = db["jobPosting"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
def root_route(): 
    return {"message": "Go to jobs"}

@app.post("/jobs")
def create_job(job: JobRole): 

    embedding_text = build_job_embedding_text(job)

    metadata = {"source": "job description"}

    pc = PineCone2()
    job_uuid = pc.add_jd_to_vector_storage(embedding_text, metadata)

    print("job uploaded to vector storage")

    job.job_uuid=job_uuid
    
    result = job_posting.insert_one(job.model_dump())
    job_id = str(result.inserted_id)
    
    return {"id": job_id}

@app.get("/jobs")
def get_jobs(): 
    jobs = list(job_posting.find())
    for job in jobs: 
        job["_id"] = str(job["_id"])
    return jobs

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        print(f"Uploading file: {file.filename}")
        
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
        unique_filename = f"{uuid.uuid4()}.{file_extension}" if file_extension else str(uuid.uuid4())
        
        file_content = await file.read()

        extracted_text = extract_text_from_pdf_bytes(file_content)

        job_uuid = "40cfd1e2-3ba1-423f-9642-d221bea798c2"

        if extracted_text:
            embedding_generator = EmbeddingGenerator()
            
            metadata = {
                "filename": file.filename,
                "s3_key": unique_filename,
                "upload_timestamp": datetime.utcnow().isoformat()
            }
            
            chunks, embeddings = embedding_generator.process_resume_text(
                extracted_text, 
                metadata
            )

            pinecone_instance = PineCone2()
            job_embedding = pinecone_instance.fetch_embedding_by_id(job_uuid)
            if job_embedding is None:
                # handle error: job UUID not found
                pass

            similarities = [cosine_similarity(job_embedding, emb) for emb in embeddings]

            # Example aggregation: max similarity score
            max_similarity = max(similarities) if similarities else 0

            print(f"Max similarity score with job {job_uuid}: {max_similarity}")


            # print(embeddings)
            
            # print(f"Created {len(chunks)} chunks with embeddings")

        # Upload to S3
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=unique_filename,
            Body=file_content,
            ContentType=file.content_type,
            Metadata={
                'original_filename': file.filename,
                'uploaded_by': 'api_user'
            }
        )
        
        s3_url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"
        
        print(f"File uploaded successfully to: {s3_url}")
        
        return {
            "message": f"File {file.filename} uploaded successfully",
            "filename": file.filename,
            "s3_key": unique_filename,
            "s3_url": s3_url,
            "file_size": len(file_content), 
            "file_content": extracted_text, 
        }
        
    except NoCredentialsError:
        print("AWS credentials error")
        raise HTTPException(
            status_code=500, 
            detail="AWS credentials not found"
        )
    except ClientError as e:
        print(f"S3 ClientError: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"S3 upload failed: {str(e)}"
        )
    except Exception as e:
        print(f"General error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Upload failed: {str(e)}"
        )
    
@app.get("/invokevs/")
async def invoke():
    pinecone_obj = PineCone2()
    pinecone_obj.add2VectorStore()
    return {"status": "documents added"}

@app.get("/retrievevs/")
async def invoke():
    pinecone_obj = PineCone2()
    docs = pinecone_obj.retrieve_documents()
    return {"documents": docs}
