import os
from typing import List, Tuple, Optional
from dotenv import load_dotenv
import openai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
import logging

load_dotenv()
logger = logging.getLogger(__name__)

class EmbeddingGenerator: 
    def __init__(self): 
        self.openai_api_key = os.getenv("OPENAI_API_KEY")

        if not self.openai_api_key:
                raise ValueError("OPENAI_API_KEY environment variable not set")
        openai.api_key = self.openai_api_key

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,          # Reasonable chunk size for embeddings
            chunk_overlap=200,        # Overlap to maintain context
            length_function=len,      # Use character count
            separators=[
                "\n\n",               # Paragraph breaks
                "\n",                 # Line breaks
                ".",                  # Sentence ends
                " ",                  # Word breaks
                ""                    # Character level (last resort)
            ]
        )
    
    def split_resume_text(self, text: str, metadata: dict = None) -> List[Document]:
        try:
            # Create a Document object
            doc = Document(
                page_content=text,
                metadata=metadata or {}
            )
            
            # Split into chunks
            chunks = self.text_splitter.split_documents([doc])
            
            logger.info(f"Split text into {len(chunks)} chunks")
            return chunks
            
        except Exception as e:
            logger.error(f"Error splitting text: {e}")
            return []
        
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]: 
        embeddings = []
        try:
            for text in texts:
                response = openai.embeddings.create(
                    input=text,
                    model="text-embedding-3-small"  # Updated model, cheaper than ada-002
                )
                embedding = response.data[0].embedding
                embeddings.append(embedding)
                
            logger.info(f"Generated {len(embeddings)} embeddings")
            return embeddings
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            return []
        
    def process_resume_text(self, text: str, metadata: dict = None) -> Tuple[List[Document], List[List[float]]]:
        try:
            # Split text into chunks
            chunks = self.split_resume_text(text, metadata)
            
            if not chunks:
                return [], []
            
            # Extract text content from Document objects
            chunk_texts = [chunk.page_content for chunk in chunks]
            
            # Generate embeddings
            embeddings = self.generate_embeddings(chunk_texts)
            
            return chunks, embeddings
        except Exception as e:
            logger.error(f"Error processing resume text: {e}")
            return [], []